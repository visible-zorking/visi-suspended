import React from 'react';
import { useContext } from 'react';

import { gamedat_ids, gamedat_object_ids, gamedat_routine_names } from '../visi/gamedat';
import { ZObject } from '../visi/zstate';

import { ReactCtx } from '../visi/context';
import { ObjPageLink, Commentary } from '../visi/widgets';

export function AboutPage()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;

    let lastupdate = '__VISIZORKDATE__';

    let curroom = '???';
    let winnername = '???';

    let map: Map<number, ZObject> = new Map();
    for (let tup of zstate.objects) {
        map.set(tup.onum, tup);
    }

    let winner = zstate.globals[114];  // WINNER
    if (true) {
        let obj = gamedat_object_ids.get(winner);
        if (obj) {
            winnername = obj.name;
        }
    }
    
    let advroom: number = winner;
    while (true) {
        let tup = map.get(advroom);
        if (!tup || tup.parent == 0 || tup.parent == gamedat_ids.ROOMS)
            break;
        advroom = tup.parent;
    }

    if (advroom != winner) {
        let obj = gamedat_object_ids.get(advroom);
        if (obj) {
            curroom = obj.name;
        }
    }
    
    function evhan_click_tab(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, tab: string) {
        ev.preventDefault();
        rctx.setTab(tab);
    }
    
    function evhan_click_routine(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, rtn: string) {
        ev.preventDefault();
        let funcdat = gamedat_routine_names.get(rtn);
        if (funcdat) {
            rctx.setLoc(funcdat.sourceloc, false);
        }
    }
    
    return (
        <div className="ScrollContent">
            <div className="AboutPage">
                <h2>What&#x2019;s going on?</h2>
                <p>
                    You are playing <i>Suspended,</i> the classic Infocom text adventure.
                    And you are watching the Z-machine execute the game,
                    live, as you play.
                </p>
                <p>
                    (In case it&#x2019;s not obvious: <em>SPOILERS</em> for <i>Suspended.</i>
                    The source code gives away every secret and solution in the game.
                    The whole point of this project is to demonstrate how
                    Infocom games work!)
                </p>
                <p>
                    Type commands in the left pane. (If you&#x2019;re not familiar
                    with parser games,{' '}
                    <ExtWebLink url={ 'https://pr-if.org/doc/play-if-card/' } text={ 'here\u2019s a quick intro' } />.)
                    As the game responds, the panes on the right will display
                    the current game state and the code that is
                    executing.
                </p>
                <p>
                    Look at the
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'objtree') }>World</a>{' '}
                    tab for a start.
                    This shows every object and room in the game.{' '}
                    The robot you are controlling,{' '}
                    <code>{ winnername }</code>,
                    is shown in the topmost room:{' '}
                    <code>{ curroom }</code>.
                    Listed with you are the objects in that room
                    (although you may not be able to see them, as
                    each robot has specific senses).
                </p>
                <p>
                    The other tabs display other aspects of the Z-machine.
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'activity') }>Activity</a>{' '}
                    shows the functions called in
                    the most recent turn, and what they printed.
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'globals') }>State</a>{' '}
                    shows all the game&#x2019;s global variables.
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'timers') }>Timers</a>{' '}
                    shows the table of timed events.
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'travel') }>Travel</a>{' '}
                    shows the table that determines where robots are heading.
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'grammar') }>Grammar</a>{' '}
                    shows the parse table.
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'map') }>Map</a>{' '}
                    is what you think.                    
                </p>
                <p>
                    Click on any function, object, or variable to see its
                    definition in the source code. Click on an object&#x2019;s
                    {' '}<ObjPageLink onum={ winner } /> button
                    to see its current state and place in the world.
                    (This will initially match the source code, but
                    may change as you interact with the game.)
                </p>
                <p>
                    <Commentary topic={ 'ABOUT' } />
                    Click on the green buttons to see commentary about{' '}
                    <i>Suspended</i>&#x2019;s implementation. Notes, trivia, whatever came
                    into my head as I was building the Visible Zorker!
                </p>
                <h2>The Underground Complex</h2>
                <p>
                    The <a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'feelies') }>Feelies</a>{' '}
                    tab is particularly important. <i>Suspended</i>{' '}
                    is an unusual game: you control six robots moving
                    around the map. You must coordinate their efforts
                    to complete the game. The Feelies tab explains the
                    special commands you will need to manage the robots.
                </p>
                <p>
                    <i>Suspended</i>{' '}
                    originally came with a full-color map and six chips to
                    track your robots&#x2019; locations. The
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'map') }>Map</a>{' '}
                    tab handles this for you. (If a robot is moving, a
                    grey marker indicates its current destination.) The 
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'travel') }>Travel</a>{' '}
                    tab shows the internal tables that manage robot movement.
                </p>
                <h2>About this release</h2>
                <p>
                    <i>Suspended</i> was the first Infocom game designed by
                    Michael Berlyn. Berlyn was not one of the original{' '}
                    <i>Zork</i> creators, but he was already an industry veteran
                    with the adventure games <i>Oo-Topos</i> and
                    {' '}<i>Cyborg</i> (Sentient Software).
                </p>
                <p>
                    As with all of Infocom&#x2019;s games,{' '}
                    <i>Suspended</i> was built using a proprietary system
                    called{' '}
                    <ExtWebLink url={ 'https://blog.zarfhome.com/2019/04/what-is-zil-anyway' } text={ 'ZIL' } />.
                    (For &#x201C;Zork Implementation Language&#x201D;.)
                </p>
                <p>
                    The game was originally released in 1983. The version
                    you see here dates from 1984. (The serial number
                    &#x201C;840521&#x201D; shows the compile date.)
                </p>
                <p>
                    There are actually two different versions of
                    &#x201C;Release 8&#x201D;, dated a year apart.
                    The only difference is that this (1984)
                    version was adjusted for the (brand-new!) Macintosh, which
                    supported proportional fonts. Certain displays in
                    the game are given a <code>fixed-width</code> flag
                    so that the tables line up properly.
                </p>
                <p>
                    This release is the one most commonly seen today,
                    because it was included in the &#x201C;
                    <ExtWebLink url={ 'https://archive.org/details/lost-treasures-of-infocom' } text={ 'Lost Treasures of Infocom' } />
                    &#x201D; collection and later collections.
                    (Except for the Amiga version of LTOI, which had the
                    1983 &#x201C;Release 8&#x201D; for some reason!)
                    Archived evidence indicates that Infocom continued
                    updating the source. The last known version is undated
                    but was intended for the &#x201C;EZIP&#x201D; Z-machine
                    (version 4), so perhaps 1985.
                </p>
                <h2>Sources and acknowledgements</h2>
                <p>
                    The game&#x2019;s source code was first{' '}
                    <ExtWebLink url={ 'https://github.com/historicalsource/suspended' } text={ 'publicly released' } />
                    {' '}by Jason Scott in April 2019.
                    I then combed through all known versions and posted my{' '}
                    <ExtWebLink url={ 'https://eblong.com/infocom/' } text={ 'Obsessively Complete Infocom Catalog' } />,
                    which now includes this Visible Zorker exhibition.
                </p>
                <p>
                    The Visible Zorker is built on a seriously customized
                    version of the{' '}
                    <ExtWebLink url={ 'https://github.com/curiousdannii/parchment' } text={ 'Parchment' } /> Z-machine interpreter
                    by Marnanel Thurman, Atul Varma, and Dannii Willis.
                    You can find this, and the rest of the Visible Zorker
                    machinery, on{' '}
                    <ExtWebLink url={ 'https://github.com/visible-zorking/visi-zork3' } text={ 'Github' } />.
                </p>
                <p>
                    I used TXD from the{' '}
                    <ExtWebLink url={ 'https://ifarchive.org/indexes/if-archive/infocom/tools/ztools/' } text={ 'ZTools' } />
                    {' '}package to analyze the game file. That
                    process was invaluably aided by the{' '}
                    <ExtWebLink url={ 'https://ifarchive.org/indexes/if-archive/infocom/tools/reform/' } text={ 'Infocom analysis work' } />
                    {' '}done in 2007 by Allen Garvin, Ben Rudiak-Gould,
                    and Ethan Dicks.
                </p>
                <p>
                    The fonts used are Courier Prime, Lato, and
                    Libre Baskerville. The header background is copied from
                    Infocom&#x2019;s Zork hint maps.
                </p>
                <p>
                    <i>Suspended</i> itself was originally written
                    by Michael Berlyn.
                    It is copyright 1983 (etc) by Infocom,
                    then Activision, then renamed to Mediagenic,
                    then Bobby Kotick bought it and renamed it Activision,
                    then Vivendi bought it and merged it with Blizzard,
                    then Microsoft consumed the lot.
                </p>
                <p>
                    Thus, the <i>Suspended</i> source code is copyright 2025 by
                    Microsoft. Microsoft has not released this game as
                    open source, but I&#x2019;m going at it regardless.
                </p>
                <p>
                    Aside from the above, the Visible Zorker is copyright
                    2025-2026 by Andrew Plotkin. MIT license;{' '}
                    <ExtWebLink url={ 'https://github.com/visible-zorking/visi-suspended' } text={ 'Github repo' } />.
                </p>
                <h2>Patreon supporters</h2>
                <ul className="PatreonList">
                    <li>
                        <b>Fancy contributors:</b>{' '}
                        <NameList level="Fancy Contributor" />
                    </li>
                    <li>
                        <b>Contributors:</b>{' '}
                        <NameList level="Contributor" />
                    </li>
                    <li className="Small">
                        <b>Participants:</b>{' '}
                        <NameList level="Participant" />
                    </li>
                    <li className="Smaller">
                        <b>Supporters:</b>{' '}
                        <NameList level="Supporter" />
                    </li>
                </ul>
                <hr/>
                <p>
                    Last updated <b>{ lastupdate }</b>.
                    This exhibit is hosted by the{' '}
                    <ExtWebLink url={ 'https://eblong.com/infocom/' } text={ 'Obsessively Complete Infocom Catalog' } />.
                </p>
            </div>
        </div>
    );
}

export function ExtWebLink({ url, text }: { url:string, text:string })
{
    return (
        <a className="External" target="_blank" href={ url }>{ text }</a>
    );
}

function NameList({ level }: { level:string })
{
    let names = patreon_donors[level];

    if (!names || names.length == 0) {
        return <></>;
    }

    let text = names.join(', ');
    return <span>{ text }</span>;
}

const patreon_donors: { [key: string]: string[] } = {
    "Contributor": ["Ben Cressey", "Brad Jones", "Christopher Cotton", "Jeff Nyman", "John Leen", "Josh Johnson", "Matthew Murray", "Paul Mazaitis", "Peter Berger", "Yoon Ha Lee"],
    "Fancy Contributor": ["David Rheingold"],
    "Participant": ["Aaron Reed", "Adam B", "Adam Thornton", "Alex Seubert", "Allyson Gray", "Anders Madsen", "Andy Baio", "Aneel Nazareth", "arcanetrivia", "chad royal", "Chris Spiegel", "Christian N", "Curtis Frye", "Damien Neil", "Daniel Sharpe", "David Cornelson", "DJ Lang", "Doug Orleans", "Emily Short", "Eric Nyman", "Georg Wille", "Henrik \u00c5sman", "J. Ryan Stinnett", "James Tranovich", "Jason Compton", "Jo Walton", "John Faulkenbury", "John Krewson", "Joshua Grams", "Jules Graybill", "Liza Daly", "Mark Musante", "Mark Sample", "Marty McGuire", "Matthew Blakley", "Matthew Griffin", "Michael Rubin", "Mike Wiese", "Monica M", "ndiddy", "Olivier L.", "Patrick Palmer", "pdxeric", "Roody Yogurt", "Tobias V. Langhoff", "Torbj\u00f6rn Andersson", "Wohali", "Y. K. Lee", "Zeke Pabski"],
    "Supporter": ["Cat", "Christopher", "crashp1t", "Daniel Smith", "Derrell Piper", "Eric Neustadter", "Kenny", "Lachlan Cooper", "Nevin", "Vivienne Dunstan"],
}
