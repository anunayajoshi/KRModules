2nd to 4th December

Trying to setup prisma and supabase. complications with typescript, as well as modules. Learnt about how modules can only be imported either through 'import' or 'require'. Prisma has a weird problem with BigInt, which cannot be serialised, and only has a temporary workaround. Also was unable to change my table to simply just use Int.

5th December
Created a structure of separating the client and server, and using an express API to communicate between the telegram bot and my database.

Now beginning to model my database.

Users

Modules

User can have multiple modules

Flow of Telegram Bot

/register

- add room_num
- modules planning on taking

/add_module

- add module planning to take
  (insert into module)

/list module

- people taking planning to take the same module

/list faculty , different mods people r taking (will search /list module)

/remove_module

- remove name from module

Table Modules

- 'name'
- 'derived faculty'

Table Planned_Modules

# i want to view what mods other people r taking also
