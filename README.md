# MTTS Client

## Client core functionality

The core functionality is travel. By choosing an endpoint on the interactive map or by searching for 
one in the search bar, you can order pods to travel or send packages with. Travel is visualised on the map.

MTTS Client main screen             |  MTTS Client quick access
:-------------------------:|:-------------------------:|
![](img/mtts%20main%20screen.jpg)  |  ![](img/mtts%20quick%20access.jpg)

### Quick access menu:

* #### Access to recent or favourite endpoints
* #### See friends list
* #### Add new friends
* #### Travel to friends
* #### Switch to package transport
* #### Open the settings menu
* #### Log out

### Default user flow:

#### Martian transport
The user:
* elects endpoint on map or enters endpoint in search bar
* selects pod type
* payment or subscription is checked
* pod arrival time and travel is visualised

#### Package transport

User:
* selects "Send Package" in quick access menu
* selects endpoint on map or enters endpoint in search bar
* payment or subscription is checked
* pod arrival time and travel is visualised

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

* File names should be kebab-case

### When styling
Every component should have it's own scss file. 
When making a new file name it `_component-name.scss` and `@use` it in the `screen.scss`.
When working with colors / shadows / basic layouts. Please use the `_util.scss` to make sure you're working with our predefined styling.

### When working with JavaScript
Just as with the styling, when working on js files we'd want to split up our compoments into different files.
* Naming should be camelCase
* Use `'` instead of `"`

### Client optimised for Iphone X display

Please note that this client is made specifically for Iphone X screens.
Set your browser accordingly to mobile and refresh your page.
Our quick access menu is built to work with touch emulation.

![](img/Iphone%20X%20setting.jpg)

### Standard user for testing

A standard user is automatically provided with the following login data:

```
Login: test
Password: test
```

## Important public urls  
* [Wiki](https://git.ti.howest.be/TI/2020-2021/s3/project-ii/projects/groep-15/client/-/wikis/home)
* [Web project](https://project-ii.ti.howest.be/mars-15/)
* [Sonar reports](https://sonar.ti.howest.be/sonar/dashboard?id=2020.project-ii%3Amars-client-15)

---

Client readme written by Liam Deferm and Daniel Vlaeminck