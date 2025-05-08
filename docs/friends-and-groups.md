## Goal

Allow users to connect with other players in the app, invite friends to matches, and manage player groups for easier match creation.

## Description

- Each user can search for players and add them as friends.
- When creating a game, the owner can invite friends from their friend list.
- Users can create and manage player groups and invite an entire group to a match with a single click.
- Only the game creator can invite players to a game. (?)

## Considerations

- Should friend/group invitations be automatically accepted or require confirmation?
- What happens if some group members already have a game at the same time?
- Should friendships be mutual (both sides approve) or one-sided?

## Requirements

### Backend

- **Friendship System**

  - Add/remove friends (e.g., `friendship` table or model).
  - Search users by name/email.
  - Get friend list.

- **Group Management**

  - Create/edit/delete a group.
  - Add/remove players in a group.

- **Game Integration**

  - Invite individual friends to a game.
  - Invite an entire group (with player availability check).
  - Only game creator can send invitations.

### Frontend

- **Friends Page**

  - Search bar and "Add Friend" button.
  - List of current friends with status indicators.

- **Groups Page**

  - Create/Edit/Delete groups.
  - Add/remove players to/from group.

- **Game Creation Page**
  - "Invite Friends" tab with checkbox list of friends.
  - "Invite Group" tab with dropdown/group list.
  - Status indicators: Invited, Joined, Declined.

## Development Roadmap

1. Build friendship data model and API.
2. Build group data model and API.
3. Implement UI for friend and group management.
4. Integrate invitations in game creation screen.
5. Test invitation flows and group sync logic.
