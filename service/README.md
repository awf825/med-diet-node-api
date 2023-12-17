# PASSPORT
https://soshace.com/securing-node-js-applications-with-jwt-and-passport-js/

## Project setup
```
npm install
```

### Run
```
node server.js
```

### Deploy to GCP app engine
Before deploying to GCP, must first install the gcloud CLI tools and select the proper project (med-diet-app):
```
gcloud init
```

To deploy to GCP, run from the root of the project:
```
gcloud app deploy
```

And to view in the browser:
```
gcloud app browse && gcloud app logs tail -s default
```