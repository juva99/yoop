# User Settings Management

## Goal

Allow users to register, manage, and update their personal information – and use it to personalize the experience across the app.

## Description

- During registration, collect essential user details (name, email, city, etc.).
- Store user settings persistently in the database.
- Use settings to improve UX, such as:
  - Auto-fill city field when creating a game.
  - Use city as default filter in game search.
- Enable users to access and edit their settings via a dedicated settings/profile page.
- Accessible from the navigation bar.

## Considerations

- How often can users update their settings (e.g., city)?
- What settings are critical vs. optional?
- How to handle settings updates while a game is ongoing or scheduled?

## Requirements

### Backend

- **User Model Enhancements**

  - add update user settings option.

- **Settings API**

  - `GET /user/settings` - fetch user settings. (?)
  - `PUT /user/settings` - update settings.

- **Defaults in Logic**
  - Use user.city as default when:
    - Searching for games (pre-fill city filter).
    - Creating a game (auto-fill city input).

### Frontend

- **Registration Form**

  - Collect city and other key preferences.

- **Profile Page**

  - All user data
  - Navigation button to edit page.

- **Edit Page**

  - Form with current user data: editable fields (city, name, etc.).
  - Save button with validation and feedback.

- **Game Creation / Game Search**

  - Auto-fill city input with user setting.
  - Allow manual override.

- **Navigation**

  - Add "Profile" to navbar.

## Development Roadmap

1. Build settings API (GET + PUT).
2. Update create and search games preference to the city.
3. Build Profile and Edit UI page.
4. Add Profile page link to navbar.
