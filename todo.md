

ACTION TREE Prep Deletion flow
==============================
    Add to processing que
    Determine if mod is installed
    If installed Prep Dependencies => Prep Installation
        Then after uninstall, remove and update modlist
        Take those changes and update Modlist
        If Modlist mod is deleted due to lack of children
        Remove mod from modlist and append new mod indexes to payload
        Then update dictionary
IMPLEMENT DYNAMIC ENTITY
<!-- REFACTOR APPLICATION FOR RXJS6 and NGRX7     -->
<!-- Handle installation -->
<!-- TEST OWNERSHIP DICT -->
<!-- THEN ADD CHANGE OF OWNERSHIP IF MOD IS PUSHED BACK IN OWNERSHIP QUE -->
<!-- REPLACE ENTRY IN OWNERSHIP ARRAY THEN SORT LOWEST TO HIGHEST -->
<!-- ADD IN PROCESSING TYPE -->
<!-- **Install stack** -->
<!-- When load order and thus installing mods, keep unpacked directories till install stack
is cleared then delete. -->
<!-- When installing copy the mod files, create the path if not in path dict or if path exists
Then copy the mod files to their destinations delete if they have ownership -->

<!-- Then create PATH OWNERSHIP DICT -->
<!-- DOUBLE CHECK index field in MOD file -->
<!-- THEN ADD SEPARATE SECTIONS TO MOD MANAGER installed: true/false -->
<!-- True on top -->
<!-- WORK ON DOWNLOAD MANAGER UI -->
<!-- ADD IN QUE TO PROCESSING
ONE AT A TIME MF -->

<!-- **MAKE SURE ONLY ONE MOD NEXUS IS OPEN AT A TIME IF ONE IS OPEN THEN FOCUS ON IT *** -->
<!-- IN IPCMAIN ADD IN BLOCKER FOR WHEN A MOD IS BEING MODIFIED AND INCLUDE A FILTER  -->

<!-- TO GET FILES FROM MAPPED DIRS LOOK FOR PATH THAT HAS A . THEN LOOP DOWN TILL YOU GET A /
CREATE PATHS IF THEY DONT EXIST -->

<!-- REMEMBER TO TEST ADM ZIP -->
<!-- ALSO TO ADD IN PREPARED OR NOT -->
<!-- 
Work on if file exists write, to save flow. Mod folder, NativePC, appState.json
Break off into seperate -->

<!-- Then unpacking zip, rar into mods/temp/ to process handle mod load order. -->
<!-- Unzip -> Map -> Check paths -> Take ownership -> Overwrite -> Delete Temp
Figure out a means to do this dynamically for load order -->
<!-- WRITE UNZIP -->
<!-- WRITE UNRAR -->

WRITE UN7ZIP - Needs testing
============================

<!-- WORK ON DIR WATCH -->
<!-- CREATE A ACTION_CHAIN THAT TRIGGERS EVERY EMIT ON NATIVEPC -->
<!-- CREATE MOD SCHEME BY FINDING BEST END PATH FOR THAT CATEGORY THEN FILTERING PATHS
    MONSTERS
    QUESTS
    ARMOR
    EFFECTS
    ETC
THEN USE THAT TO CREATE A MOD LIST
    AGGREGATED THE SAME WAY YOU MAPPED THE DIRS
    PER MOD CATEGORY FILTER ONLY THOSE PATHS
    AND MAKE ADD THOSE TO A CLASS MOD LIST
DISABLED MODS ARE PACKED INTO RARS IN CUSTOM MOD PATH -->
<!-- NEW MODS GO THERE AS WELL -->
<!-- DO NOT DELETE UNLESS ASKED -->
RELY ON DIR WATCH TO UPDATE AND TRIGGER MOD STATE TOGGLED
    This is for Anon mods
<!-- EACH MOD HAS A LOAD ORDER BY INDEX -->
<!-- THIS IS STORED IN THAT MODS JSON -->
<!-- ALONG WITH AUTHOR INFO + IMAGES -->
EDITABLE FROM LAUNCHER
    Edit editable mod info
<!-- GENERATES A DEFAULT JSON IF NONE WERE FOUND WITH NAME FROM CATEGORY -->
<!-- IF MULTIPLE MODS HAVE THE SAME TITLE, THEY ARE GROUPED INTO ONE MOD -->
<!-- THUS MOD LIST IS A ARRAY MANIFEST POINTING TO EACH MOD INCLUDED BY MOD_NAME -->
    <!-- MOD_LIST {
        mods: [
                {
                    PATH: [string],
                    DATA: [JSON],
                    //REST ARE COPIED FROM DATA
                    //STARTS OFF AS ONE PATH DATA
                    //THEN REDUCES REDUCES IN LOOP TILL NO PAIRS FOUND
                    //RETURNS CONSOLIDATED MOD LIST
                    AUTHOR: string,
                    CATEGORY: string = determined by FILTER
                    MOD_TITLE: string,
                    VERSION: DATE,
                    IMAGES: [pathToImage],
                    enabled: boolean
                }
            ]
    }; -->
<!-- **** WHICH MEANS SAVE LOAD ACTION_CHAIN NEEDS TO BE WORKING FOR MAIN STATE FOR SAME WORKFLOW ***** -->

<!-- REMEMBER TO CODE IN A LOADING OVERLAY FOR THIS SHIT -->

FIGURE OUT INSTALLER

<!-- CREATE EASY MEANS OF DOWNLOADING STUFF OFF OF MOD NEXUS -->

ADD IN TOOL BUTTON AND TOOL CATEGORIES
    MODDING TOOLS
    GRAPHICS

THEN CREATE MONSTER VARIATIONS MOD FINALLY

THINK ABOUT QUEST WEAPON AND ARMOR HOOKS
REALLY NEED A ACTION API FOR MEMORY READS AND INJECTION
ABILITY TO CHANGE OUT SPECIFIC ARMOR PIECES ONLY IF YOU GOT THE DROPS IN LAUNCHER
