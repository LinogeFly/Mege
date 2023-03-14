# Prototype

To-do list of things to try and test in prototype version.

## To-do

- [ ] Make design mockups.
- [ ] Make sure unhandled exceptions in front-end are logged.
- [ ] Make sure front-end exceptions have call stack logged.
- [ ] Look into browser caching. Images don't need to be requested by the browser all the time and can be cached.
- [ ] Show "loading..." text with a delay, not right away.
- [ ] Wait for image to be loaded before removing "Loading..." on the meme template page.
- [ ] Send "status" or "success" property in response from the back-end instead of 404 for the cases when meme template is not found.
- [ ] Store filename in the database when uploading new templates. This is useful to get a proper MIME type when returning images from the API.
- [ ] Enable and configure CORS.
- [ ] Double check for XSS vulnerabilities.

### MemeTemplate component

- [ ] Replace mouse events with pointer events, so resizable boxes work in mobile mode as well.
- [ ] Fix error 404 handling. At the moment `.then` functions that follow `this.props.history.push('/404');` line are still going to be called.

### TextSettings component

Add more text options:

- [ ] Font
- [ ] ALL CAPS
- [ ] Shadow, outline, none
- [ ] Outline width
- [ ] Max font size
- [ ] Text align
- [ ] Vertical align
- [ ] Opacity

- [ ] Add a color picker with pre-defined standard colors.

### TextRect component

- [ ] Introduce minimum size for TextRect component. This should solve possible stack overflow issue when making the rectangle way too small.
- [ ] Responsiveness. The component should scale as viewport width changes.
- [ ] Convert direction string values to enumeration type.

### Canvas component

### Refactoring

- [ ] Create "pages" folder inside of "components" folder for page type of components.
- [ ] Have a module with string constants for error messages.
- [ ] Figure out if leaking of value object types from Core/Entities to Web/DTOs is ok or not. For example, `Rect` type.
- [ ] Add `Color` structure that will validate the color value in the constructor.

### Bug fixing

- [ ] Fix "Warning: Can't perform a React state update on an unmounted". To fix that we need to add `AbortController` usage for all asynchronous fetches.

## To-study

- [ ] [Asynchronous programming with async and await](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/).
- [ ] [The Repository and Unit of Work Patterns](https://docs.microsoft.com/en-us/aspnet/mvc/overview/older-versions/getting-started-with-ef-5-using-mvc-4/implementing-the-repository-and-unit-of-work-patterns-in-an-asp-net-mvc-application).
- [ ] [Nullable reference types](https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references).
- [ ] [Logging in .NET Core and ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-6.0).
- [ ] [Mastering margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing).

## Architecture

DDD and Clean Architecture examples:

- <https://github.com/marcosouzapublic/MacPartners>
- <https://github.com/dotnet-architecture/eShopOnWeb>
- <https://github.com/ardalis/CleanArchitecture>

## Routing

### /

Shows the list of meme templates.

Available generic actions:

- Create new meme template
- Filter meme templates in the list

Available actions for each meme template item in the list:

- Go to meme page
- Rename
- Delete (yes/no confirmation)

### /meme/{id}

Loads existing meme template. Available actions:

- Generate meme
- Reset
- Update meme template
- Delete meme template (yes/no confirmation)

### /new-template

Allows to create a new meme template. The user flow:

1. Add an image from your computer or from external URL
2. Add a meme template name
3. Press "Upload"
4. Get redirected the meme page

## Authentication

Requirements:

- [x] Protect API endpoints with `[Authorize]` attribute.
- [x] Protect a client-side route. Redirect to `/login` if not authenticated when navigating through pages. Basically it's about implementing `ProtectedRoute` component that will check if user is authenticated and it not - redirecting them to `/login`.
- [ ] Authenticate API requests. If authorization fails during a request within a page, for example, when changing pages on Meme Template List page, redirect to `/login`.
- [x] Persist the authentication, so users don't need to log in if they keep using the site.
- [ ] Check authentication cookie implementation in **eShopOnWeb** sample project.

API:

- [x] api/login
- [x] api/logout
- [x] api/register
- [x] api/user

UI routes:

- [x] /login
- [x] /logout
- [ ] /register

Feature toggles:

- [x] Disable new users registration. Can be a configuration parameter, for example `Feature:DisableRegistration`.

## UI

Websites for inspiration:

- https://github.com/ (login form)
- https://discord.com/ (pop-up menu, color palette)
- https://stackoverflow.com/ (color palette, dropdown menus with tilde)
- https://css-tricks.com/ (tabs that you can toggle on and off)
- Google Spreadsheet mobile app (nice grey colors and buttons)
- Azure DevOps:
  - White navbar menu
  - "More" three dots buttons
- https://jsfiddle.net/ (settings menu)
- https://dribbble.com/tags/text_editing
- https://www.pinterest.com/search/pins/?q=rich%20text%20editor%20ui
- Syncthing (color palette, buttons, navbar)
- https://www.twitch.tv/ (dropdown menu shadow)

### Home page

### Meme Template page

### Log-in page
