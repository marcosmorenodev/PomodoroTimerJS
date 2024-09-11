Run requirement: Requires "Live Server" extension found on VS Code store. 
You can get it here: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

-This projects consists of two scripts: the main app and the settings one.
The main app is in charge of the timer functions, DOM manipulation and keeping track of the done sessions as well as the current sessions done so far.
-A brief note about sessions: A "session" is done once the "active mode" are done. Basically, the span of time in which the user should focus on their task.
Once these minutes are done, the "break mode" will be triggered, which lets the user take a break from their task. And once 4 sessions have been finished, the "long break mode" will be triggered, which lets the user take a longer break. When this mode ends, it will reset the cycle of sessions back to 0 and will add 1 to the "done sessions" counter.
-By making a deep copy of the "definitive" settings in the global scope, allows the program to mutate the values only in the timer's scope. Thus, making pausing and resuming feasible.

The settings script is in charge of customize the timer's settings (active minutes, break minutes, long break minutes and the app's theme). Once the changes are made, an object called "userSettings" will be stored in localStorage for the app's usage.
-If the user has ONLY changed one of the settings values, the rest will be null, however, this process has a "safety-net" so to speak: In the main script, when creating the "definitive" settings (prior to making a deep copy of them) it will check for the values of the custom settings, and if they're null, their values will be the ones from the default settings. This ensures a flawless timer usage, as they won't be any faulty values used.
-In the settings tab, if the user has modified one or more of the settings but hasn't saved them before closing it, the app will be reloaded in order to prevent any unexpected mutations or timer malfunction.