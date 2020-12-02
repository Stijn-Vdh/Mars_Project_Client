# MTTS Client

## Setting up
First let's make sure you have the repo on your device.
```bash
git clone https://git.ti.howest.be/TI/2020-2021/s3/project-ii/projects/groep-15/client.git
```
After you've done this you'll want to install make sure you install all the dependencies.
```bash
npm install
```
And for sass make sure you have sass installed.
```bash
npm install -g sass
```
The reason we use -g is installed on your pc instead as a dependency of the project.
Now you're  all set-up to use the client. Make sure to read the [Wiki](https://git.ti.howest.be/TI/2020-2021/s3/project-ii/projects/groep-15/client/-/wikis/home) if there are any more questions about sass or some of the JS components.

## Working on the client
When working on the client we want you to use our practices to keep the codebase consistent.

* File names should be kebap-cas

### When styling
Every component should have it's own scss file. 
When making a new file name it `_component-name.scss` and `@use` it in the `screen.scss`.
When working with colors / shadows / basic layouts. Please use the `_util.scss` to make sure you're working with our predefined styling.

### When working with JavaScript
Just as with the styling, when working on js files we'd want to split up our compoments into different files.
* Naming should be camelCase
* Use `'` instead of `"`

### Alpha functionality
When loading the alpha page you'll be prompted to login. You're currently not able to sign up but you can use a random name and password. You won't be authenticated but you'll have a demo of the app.
Current working features
* Ordering a pod
* Search bar
* Settings
* Look at your user settings
* Look at the report page

## Important public urls  
* [Wiki](https://git.ti.howest.be/TI/2020-2021/s3/project-ii/projects/groep-15/client/-/wikis/home)
* [Web project](https://project-ii.ti.howest.be/mars-15/)
* [Sonar reports](https://sonar.ti.howest.be/sonar/dashboard?id=2020.project-ii%3Amars-client-15)