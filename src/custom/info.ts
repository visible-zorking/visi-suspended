
/* Return the initial sourceloc to display. */
export function sourceloc_start() : string
{
    return 'O:299:1:313:0';  // 'verbs.zil', lines 299-312
}

// Presentation order. Filenames must match game-info!
export const sourcefile_presentation_list: string[] = [
    'suspended.zil',
    'rooms.zil',
    'objects.zil',
    'robots.zil',
    'people.zil',
    'globals.zil',
    'goal.zil',
    'main.zil',
    'setup.zil',
    'parser.zil',
    'syntax.zil',
    'verbs.zil',
    'macros.zil',
    'clock.zil',
    'crufty.zil',
];

export const robot_names: string[] = [
    'NONE', 'IRIS', 'WALDO', 'SENSA', 'AUDA', 'POET', 'WHIZ', 'PEOPLE'
];
