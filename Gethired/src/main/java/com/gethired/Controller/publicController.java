package com.gethired.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.gethired.Entities.User;
import com.gethired.Services.EmailService;
import com.gethired.Services.UserDetailserviceimpl;
import com.gethired.Services.UserService;
import com.gethired.Utils.JwtUtils;

@RestController
@RequestMapping("/public")
public class publicController {
     @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserDetailserviceimpl userDetailserviceimpl;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private EmailService emailService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody User user){
        try {
            userService.signupuser(user);
            return new ResponseEntity<>(true,HttpStatus.OK);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    
     @PostMapping("/login")
    public ResponseEntity<String> loginvendor(@RequestBody User user) {
        try{
            authenticationManager.authenticate( new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            UserDetails userDetails = userDetailserviceimpl.loadUserByUsername(user.getEmail());
            String jwt = jwtUtils.generateToken(userDetails.getUsername());
            System.err.println("user login successfully " +  userDetails.getUsername());
            return new ResponseEntity<>(jwt, HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>("Incorrect username or password",HttpStatus.BAD_REQUEST);
            // Add logging here!
        }

    }
    @PostMapping("/google-auth-callback")
     public ResponseEntity<?> googleauth(@RequestBody Map<String, String> body) {
         String code = body.get("code");
        if (code == null) {
            return ResponseEntity.badRequest().body("Authorization code 'code' is missing from the request body.");
        }

     try {
            System.out.println("Received code from frontend: \n" + code);

            String tokenEndpoint = "https://oauth2.googleapis.com/token";
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", "950084142781-o9prl3b49at4roi8diqj1r5hoe5lsait.apps.googleusercontent.com");
            // *** IMPORTANT: REPLACE THIS WITH YOUR ACTUAL CLIENT SECRET FROM GOOGLE CLOUD CONSOLE ***
            // The screenshot showed your secret ends in 'ZcW', so use the full string.
            params.add("client_secret", "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");
            params.add("redirect_uri", "http://localhost:5173/login"); // Must match frontend and Google Cloud Console exactly
            params.add("grant_type", "authorization_code");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            System.out.println("Sending token exchange request to Google: \n" + request);

            // This will now have a proper body!
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenEndpoint, request, Map.class);


        

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to exchange code for tokens with Google.");
        }

        String idToken = (String) response.getBody().get("id_token");
        if (idToken == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ID Token not received from Google.");
        }

        // Get user info from the ID token
        String userInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        ResponseEntity<Map> userInfoResponse = restTemplate.getForEntity(userInfoUrl, Map.class);

        if (userInfoResponse.getStatusCode() == HttpStatus.OK && userInfoResponse.getBody() != null) {
            Map<String, Object> userInfo = userInfoResponse.getBody();
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");

            UserDetails existingUser = null;
            try {
                existingUser = userDetailserviceimpl.loadUserByUsername(email);
            } catch (UsernameNotFoundException e) {
                // Register new Google user
                User newCustomer = new User();
                newCustomer.setUsername(email); // Using email as username
                newCustomer.setName(name);
                newCustomer.setEmail(email);
                newCustomer.setPassword(null); // No password for Google user

                userService.signupuser(newCustomer);
                existingUser = userDetailserviceimpl.loadUserByUsername(email);
            }

            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("User data not available for JWT generation.");
            }

            String jwt = jwtUtils.generateToken(email);
            System.out.println("Generated JWT: " + jwt);
            return ResponseEntity.ok(jwt);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to fetch user info from Google");
    } catch (Exception e) {
        e.printStackTrace();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred during Google authentication: " + e.getMessage());
    }
}
@PostMapping("/Linkedin-auth-callback")
     public ResponseEntity<?> linkdedauth(@RequestBody Map<String, String> body) {
                 String code = body.get("code");


    try {
        System.out.println("Received code from frontend: " + code);

        String tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", "78a5ldmurs1o8g");
        params.add("client_secret", "WPL_AP1.GtdhqOpCNRAXV58e.r0f8Rw==");
        params.add("redirect_uri", "http://localhost:5173/login"); // Must match frontend exactly
        params.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        System.out.println("Sending token exchange request to Google with params: " + params);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenEndpoint, request, Map.class);

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to exchange code for tokens with Google.");
        }

        String accessToken = (String) response.getBody().get("access_token");
        System.out.println(accessToken);
        if (accessToken == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ID Token not received from Google.");
        }

        // Get user info from the ID token
    HttpHeaders profileHeaders = new HttpHeaders();
    profileHeaders.set("Authorization", "Bearer " + accessToken);

    HttpEntity<Void> profileRequest = new HttpEntity<>(profileHeaders);

    ResponseEntity<Map> userInfoResponse = restTemplate.exchange(
        "https://api.linkedin.com/v2/userinfo",
        HttpMethod.GET,
        profileRequest,
        Map.class
    );
        

        if (userInfoResponse.getStatusCode() == HttpStatus.OK && userInfoResponse.getBody() != null) {
            Map<String, Object> userInfo = userInfoResponse.getBody();
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            System.out.println(email);
            System.out.println(name);
            UserDetails existingUser = null;
            try {
                existingUser = userDetailserviceimpl.loadUserByUsername(email);
            } catch (UsernameNotFoundException e) {
                // Register new Google user
                User newCustomer = new User();
                newCustomer.setUsername(email); // Using email as username
                newCustomer.setName(name);
                newCustomer.setEmail(email);
                newCustomer.setPassword(null); // No password for Google user

                userService.signupuser(newCustomer);
                existingUser = userDetailserviceimpl.loadUserByUsername(email);
            }

            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("User data not available for JWT generation.");
            }

            String jwt = jwtUtils.generateToken(email);
            System.out.println("Generated JWT: " + jwt);
            return ResponseEntity.ok(jwt);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to fetch user info from Google");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred during Google authentication: " + e.getMessage());
    }
}
  @PostMapping("/sendotp")
  public ResponseEntity<?> sendotp(@RequestBody String email){
    try {
        System.out.println(email);
        userService.sendotp(email);
        
        return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
        // TODO: handle exception
        e.printStackTrace();
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
  }
   @PostMapping("/forgot")
    public ResponseEntity<?> forgot(@RequestParam String email, @RequestParam String otp){
        try {

           if(userService.forgotps(email, otp)){
            return new ResponseEntity<>(HttpStatus.OK);
           }
           else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
           }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
    @PostMapping("/setPassword")
    public ResponseEntity<?> setpass(@RequestParam String email, @RequestParam String newPassword){
        try {
            System.out.println(email);
            userService.setpass(email,newPassword);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
