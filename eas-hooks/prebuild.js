const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const googleServicesJson = process.env.GOOGLE_SERVICES_JSON;
  if (googleServicesJson) {
    const filePath = path.join(process.cwd(), 'android', 'app', 'google-services.json');
    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, googleServicesJson);
    console.log('Successfully created google-services.json from environment variable');
  } else {
    console.warn('GOOGLE_SERVICES_JSON environment variable not found');
  }
};