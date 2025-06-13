# React & Node.js Skill Test

## Estimated Time

- 60 min

## Requirements

- Bug fix to login without any issues (20min) <br/>
  There is no need to change or add login function.
  Interpret the code structure and set the correct environment by the experience of building projects. <br/>
  Here is a login information. <br/>
  ✓ email: admin@gmail.com  ✓ password: admin123

- Implement Restful API of "Meeting" in the both of server and client sides (40min)<br/>
  Focus Code Style and Code Optimization. <br/>
  Reference other functions.

## Approach

- Since login function was not to be touched, instead of using process.env.JWT_SECRET, i used the 'secret_key' as specified but note that this is not best practice.

- For Solution 2, in constant.js make sure your baseUrl is pointing directly to the nodejs server url

- For Solution 2 Client side, files edited, src/service/api.js, views/admin/meeting/components/Addmeeting.js, views/admin/meeting/index.js, views/admin/meeting/View.js, etc

- For Solution 2 Server side, files edited, controllers/meeting/meetings.js, controllers/meeting/_routes.js. etc
