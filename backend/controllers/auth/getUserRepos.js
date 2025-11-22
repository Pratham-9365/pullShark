import getDecryptedGithubToken from "../../utils/decryptGithubToken.js";
import axios from "axios";

export default async function getUserRepos(req, res) {
  try {
  
    const user = req.user;
    if (!user || !user.userId) return res.status(401).json({ success: false, message: "User not authenticated" });
 //console.log(user);
 
    const accessToken = req.cookies.accesstoken;
    //console.log(accessToken);
    if (!accessToken) return res.status(401).json({ success: false, message: "GitHub token not found" })
    const payload =  await getDecryptedGithubToken(accessToken);
    //console.log(payload);
    
    
    

  
    const per_page = 100;
    let page = 1;
    let allRepos = [];

    while (true) {
      const response = await axios.get("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${payload.ghAccessToken}` },
        params: { page, per_page, sort: "updated" }
      });
      const repos = response.data || [];
      allRepos = allRepos.concat(repos);
      if (repos.length < per_page) break; // last page
      page += 1;
    }

    res.json({ success: true, repos: allRepos });
  } catch (err) {
    console.error("getUserRepos error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}