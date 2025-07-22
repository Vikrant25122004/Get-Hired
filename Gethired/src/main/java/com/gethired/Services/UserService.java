package com.gethired.Services;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.CriteriaDefinition;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException.TooManyRequests;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.gethired.Controller.publicController;
import com.gethired.Entities.Education;
import com.gethired.Entities.Experience;
import com.gethired.Entities.LinkedinJobs;
import com.gethired.Entities.User;
import com.gethired.Repositories.EducationRepo;
import com.gethired.Repositories.ExperienceRepo;
import com.gethired.Repositories.UserRepo;

import io.jsonwebtoken.security.Jwks.HASH;
@Service
public class UserService {
     @Autowired
    private UserRepo userRepo;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ExperienceRepo experienceRepo;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private EducationRepo educationRepo;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired 
    private RedisService redisService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    public void signupuser(User user) {
        String html =  "<!DOCTYPE html>" +
        "<html>" +
        "<head>" +
        "<meta charset='UTF-8'>" +
        "<title>Email</title>" +
        "</head>" +
        "<body style='background-color: #ffffff; font-family: Arial, sans-serif; margin: 0; padding: 0;'>" +

        "<table align='center' width='600' cellpadding='0' cellspacing='0' " +
        "style='border: 1px solid #ddd; background-color: #ffffff; padding: 20px;'>" +

        "<tr>" +
        "<td align='center' style='padding: 20px 0;'>" +
        "<h1 style='color: #333333;'>Welcome to Get Hired</h1>" +
        "</td>" +
        "</tr>" +

        "<tr>" +
        "<td style='padding: 20px; color: #555555; font-size: 16px;'>" +
        "<p>Hi <strong>User</strong>,</p>" +

        "<p>Thank you for signing up! We're excited to have you on board.</p>" +

        "<p style='margin: 20px 0;'>Here’s what you can do next:</p>" +
        "<ul style='padding-left: 20px;'>" +
        "<li>Explore our dashboard</li>" +
        "<li>Update your profile</li>" +
        "<li>Start building your resume</li>" +
        "</ul>" +

        "<p style='margin-top: 30px;'>If you have any questions, feel free to contact us anytime.</p>" +

        "<p style='margin-top: 30px;'>Best regards,<br>" +
        "<strong>Get Hired Team</strong></p>" +
        "</td>" +
        "</tr>" +

        "<tr>" +
        "<td style='background-color: #f5f5f5; padding: 15px; text-align: center; color: #888888; font-size: 12px;'>" +
        "© 2025 Get Hired. All rights reserved." +
        "</td>" +
        "</tr>" +

        "</table>" +
        "</body>" +
        "</html>";

        if(user.getPassword()==null){
            userRepo.save(user);
            emailService.messages(user.getEmail(),"welcome to Be Professional", html);
            return;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        emailService.messages(user.getEmail(),"welcome to Be Professional", html);


       
    }
    
    public boolean sendotp(String email) {
        int otp = (int)(Math.random() * 900000) + 100000;
        String Otp = String.valueOf(otp);
        User user = userRepo.findByEmail(email);
        if(user==null){
            return false;
        }
        
        
        String html = "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'><title>OTP Verification</title></head>" +
                "<body style='background-color: #ffffff; font-family: Arial, sans-serif; margin: 0; padding: 0;'>" +
                "<table align='center' width='600' cellpadding='0' cellspacing='0' " +
                "style='border: 1px solid #ddd; background-color: #ffffff; padding: 20px;'>" +
                "<tr><td align='center' style='padding: 20px 0;'>" +
                "<h2 style='color: #333333;'>OTP Verification</h2></td></tr>" +

                "<tr><td style='padding: 20px; color: #555555; font-size: 16px;'>" +
                "<p>Hi <strong>" + email + "</strong>,</p>" +
                "<p>Your One-Time Password (OTP) is:</p>" +
                "<p style='font-size: 28px; font-weight: bold; color: #2e6ad0; text-align: center; margin: 20px 0;'>" +
                otp + "</p>" +
                "<p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>" +
                "<p>Regards,<br><strong>Get Hired Team</strong></p>" +
                "</td></tr>" +

                "<tr><td style='background-color: #f5f5f5; padding: 15px; text-align: center; " +
                "color: #888888; font-size: 12px;'>© 2025 Get Hired. All rights reserved.</td></tr>" +
                "</table></body></html>";

        try {
            emailService.messages(email, Otp, html);
            redisService.setLog(Otp + email,Otp, 300L);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to send OTP email: " + e.getMessage());
            return false;
        }
    

    }

    public boolean forgotps(String email, String otp) {
        String otpp = redisService.get(otp+email);
        System.out.println(otpp);
        if(otpp==null){
            return false;
        }
        else if(otpp.equals(otp)){
            return true;
        }
        else{
            return false;
        }
    }

    public void setpass(String email, String password) {
        User user = userRepo.findByEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepo.save(user);
    }

    public void updatepic(MultipartFile proficpic,String username) throws IOException {
        User user = userRepo.findByEmail(username);
        user.setProfilpicname(proficpic.getOriginalFilename());
        user.setProfilepictype(proficpic.getContentType());
        user.setProfilepicbyte(proficpic.getBytes());
        userRepo.save(user);

    }
    public User getuser(String username){
        User user = userRepo.findByEmail(username);
        return user;

    }

    public void updateuserr(User user, String username) {
        User user2 = userRepo.findByUsername(username);
        if(user.getAddress()!=null){
            user2.setAddress(user.getAddress());
        }
        if(user.getEmail()!=null){
            user2.setEmail(user.getEmail());
        }
        if(user.getName()!=null){
            user2.setName(user.getName());
        }
        if(user.getPhonenumber()!=null){
            user2.setPhonenumber(user.getPhonenumber());

        }
         if(user.getUsername()!=null){
            user2.setUsername(user.getUsername());

        }
        if (user.getPassword()!=null) {
            user2.setPassword(passwordEncoder.encode(user.getPassword()));

            
        }
        userRepo.save(user2);

    }
    public void addexp(Experience experience, String username){
        if(experience.getEndDate()==null){
            experience.setEndDate("Present");

        }
        experience.setEmail(username);
        experienceRepo.save(experience);
    }
    public List<Experience> getexperience(String Email){
        Query query = new Query();
            query.addCriteria(Criteria.where("email").is(Email));

            // 3. Execute the query using mongoTemplate to get a list of experiences
            List<Experience> experiences = mongoTemplate.find(query, Experience.class);

        return experiences;
    }
    public void addedu(Education education, String username){
        education.setUsername(username);
        educationRepo.save(education);
    }
    

    public List<Education> getedu(String username){
        Query query = new Query();
            query.addCriteria(Criteria.where("username").is(username));
            List<Education> educations = mongoTemplate.find(query, Education.class);
        return educations;
    }
       

public List<LinkedinJobs> getlinkjobs(String position) {
    // Replace spaces with "-" or encode properly
    String query = position.replace(" ", "-");

    String baseUrl = "https://jsearch.p.rapidapi.com/search";

    // Build URI with query param
    UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
            .queryParam("query", query)
            .queryParam("num_pages",45)
            .queryParam("country","in");

    URI uri = builder.build().encode().toUri();

    HttpHeaders headers = new HttpHeaders();
    headers.add("X-RapidAPI-Host", "jsearch.p.rapidapi.com");
    headers.add("X-RapidAPI-Key", "3b03bdd116msha32ee71e9dec373p19d2cejsnb6b676561f11");  // Your actual API key

    HttpEntity<String> entity = new HttpEntity<>(headers);
    
    RestTemplate restTemplate = new RestTemplate();
    List<LinkedinJobs> hJobs = new ArrayList<>();


    // Ideally map to a proper response class, here using String as example
    ResponseEntity<HashMap> response = restTemplate.exchange(uri, HttpMethod.GET, entity, HashMap.class);
    ArrayList<HashMap<String, String>> res =  (ArrayList<HashMap<String, String>>) response.getBody().get("data");
   for (int i = 0; i < res.size(); i++) {
    LinkedinJobs linkedinJobs = new LinkedinJobs();

    String result = res.get(i).get("job_title");
    linkedinJobs.setPosition(result);

    String location = res.get(i).get("job_location");
    linkedinJobs.setLocate(location);

    String companyname = res.get(i).get("employer_name");
    linkedinJobs.setCompanyname(companyname);

    String postedat = res.get(i).get("job_posted_at");
    linkedinJobs.setPostingdate(postedat);

    // Extract apply link from apply_options array
    Object applyOptionsObj = res.get(i).get("apply_options");
    if (applyOptionsObj instanceof ArrayList) {
        ArrayList<HashMap<String, Object>> applyOptions = (ArrayList<HashMap<String, Object>>) applyOptionsObj;
        if (!applyOptions.isEmpty()) {
            // For example, get the first apply_link
            String applylink = (String) applyOptions.get(0).get("apply_link");
            System.out.println("Apply link: " + applylink);
            linkedinJobs.setApplylink(applylink);
        }
    }

    String img = res.get(i).get("employer_logo");
    linkedinJobs.setImgurl(img);

    hJobs.add(linkedinJobs);

    System.out.println(result);
}

    // TODO: parse JSON response into List<LinkedinJobs> using Jackson or Gson

    return hJobs;  // Return actual mapped results here
}


}
