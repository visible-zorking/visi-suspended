import React from 'react';
import { useContext } from 'react';

import { ReactCtx } from '../visi/context';
import { ExtWebLink } from './about';

export function FeeliesPage()
{
    let rctx = useContext(ReactCtx);
    
    function evhan_click_tab(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, tab: string) {
        ev.preventDefault();
        rctx.setTab(tab);
    }
    
    return (
        <div className="ScrollContent">
            <div className="FeeliesPage">
                <h2>Life as the Central Mentality</h2>
                <p>
                    In <i>Suspended</i>, you are a cryogenically frozen
                    &#x201C;volunteer&#x201D; in the facility
                    that manages life on planet Contra. If something goes
                    wrong in the Complex, you must coordinate the
                    facility&#x2019;s six robots to repair the damage.
                    Each robot has specific senses and capabilities which
                    you must take into account.
                </p>
                <p>
                    Sounds like fun, right? Remember that damage in the
                    Complex means catastrophe on the surface. The
                    &#x201C;Score&#x201D; shown in the status line is
                    the current death rate in thousands of people{' '}
                    <em>per turn</em>. Work fast.
                </p>
                <h2>Special commands:</h2>
                <p>
                    The game&#x2019;s original manual is reproduced below.
                    Here is a quick overview:
                </p>
                <p>
                    Any command can be directed to a specific robot:
                    <br/>
                    <code>WALDO, TAKE PLIERS</code>
                    <br/>
                    <code>SENSA, EXAMINE CABLE</code>
                    <br/>
                    If you don&#x2019;t name a robot, your command will be
                    directed to the same robot you last spoke to. The
                    currently-controlled robot is shown in the upper left.
                </p>
                <p>
                    You can direct a command to multiple robots:
                    <br/>
                    <code>POET AND WHIZ, GO TO CENTRAL CORE</code>
                    <br/>
                    <code>ALL ROBOTS, REPORT</code>
                    <br/>
                    To instruct two robots to work together on a single
                    task, you must say <code>BOTH</code>:
                    <br/>
                    <code>BOTH POET AND IRIS, OPEN MANHOLE</code>
                </p>
                <p>
                    You can use normal direction commands (<code>NORTH</code>,
                    {' '}<code>SOUTH</code>, etc)
                    but it&#x2019;s more efficient to give a destination:
                    <br/>
                    <code>POET, GO TO ENTRY AREA</code>
                    <br/>
                    You can name any room in the Complex, or another
                    robot:
                    <br/>
                    <code>WALDO, GO TO POET</code>
                    <br/>
                    It will probably take the robot several turns to reach
                    its destination. You can command other robots
                    in the meantime. You can even have several robots
                    in transit at the same time. They will report in when
                    they arrive.
                </p>
                <p>
                    Other handy commands:
                </p>
                <p>
                    <code>REPORT LOCATION</code> &#x2014;
                    Name the robot&#x2019;s location.
                    <br/>
                    <code>REPORT</code> &#x2014;
                    Give a full report, including room description and
                    inventory.
                    <br/>
                    <code>ARL</code> &#x2014;
                    Short for <code>ALL ROBOTS, REPORT LOCATION</code>.
                    <br/>
                    <code>ARR</code> &#x2014;
                    Short for <code>ALL ROBOTS, REPORT</code>. This
                    takes several turns.
                    <br/>
                    <code>SCORE</code> &#x2014;
                    Show the current total of casualties on the surface.
                    <br/>
                    <code>DRAG <i>robot</i> to <i>room</i></code> &#x2014;
                    Haul a dysfunctional robot to another location.
                    <br/>
                    <code>FOLLOW <i>robot</i></code> &#x2014;
                    Have a robot follow another.
                    <br/>
                    <code>STOP</code> &#x2014;
                    Tell a robot in transit to halt where it is.
                    <br/>
                    <code>LISTEN</code> &#x2014;
                    Tell Auda to activate her audio circuits and relay
                    what she hears directly to you.
                    <br/>
                    <code>PLUG IN</code> &#x2014;
                    Whiz has the ability to connect to
                    the CLC pedestals in the four Peripheral rooms.
                    He can then query the Library Core about various
                    topics.
                    <br/>
                    <code>QUERY ABOUT <i>topic</i></code> &#x2014;
                    Have Whiz query the pedestal he is plugged into.
                </p>
                <h2>The map</h2>
                <p>
                    The original game came with a map and six chips
                    representing the robots. You could use these to
                    track their locations as you played. In this version,
                    you can follow along in the
                    {' '}<a className="Internal" href="#" onClick={ (ev)=>evhan_click_tab(ev, 'map') }>Map</a>{' '}
                    tab.
                </p>
                <h2>The manual</h2>
                <p>
                    Note: These images are scanned from the the honest-to-Frob
                    copy of <i>Suspended</i> that I played as a kid! They are
                    from the original 1983 &#x201C;Folio&#x201D; release of
                    the game. For a scan of the &#x201C;Grey Box&#x201D;
                    manual, visit the{' '}
                    <ExtWebLink url={ 'https://infodoc.plover.net/manuals/temp/suspende.pdf' } text={ 'InfoDoc Project' } />.
                    For high-resolution scans, visit the{' '}
                    <ExtWebLink url={ 'https://archive.org/details/Suspended-Infocom-Apple' } text={ 'Internet Archive' } />.
                </p>
                <hr />
                <FeelieLink url={ 'manual-p1.jpeg' } width={ 250 } height={ 125 } text={ 'Letter from from the Contra Central Lottery Commission' } />
                <FeelieLink url={ 'manual-p2.jpeg' } width={ 250 } height={ 125 } text={ 'The Filtering Computers' } />
                <FeelieLink url={ 'manual-p3.jpeg' } width={ 250 } height={ 125 } text={ 'Robots: Communications and Characteristics' } />
                <FeelieLink url={ 'manual-p4.jpeg' } width={ 250 } height={ 125 } text={ 'The Central Library Core / Surface Systems' } />
                <FeelieLink url={ 'manual-p5.jpeg' } width={ 250 } height={ 125 } text={ 'Abridged List of Useful Commands' } />
                <FeelieLink url={ 'manual-p6.jpeg' } width={ 250 } height={ 125 } text={ 'Operator\u2019s Reference Chart' } />
                <hr />
                <p>
                    And to set the scene, this was the manual cover, which
                    was hidden behind the package&#x2019;s serene cryogenic
                    mask:
                </p>
                <FeelieLink url={ 'manual-cover-front.jpeg' } width={ 250 } height={ 333 } text={ 'Manual front cover' } />
                <FeelieLink url={ 'manual-cover-back.jpeg' } width={ 250 } height={ 333 } text={ 'Manual back cover, with an introduction to Michael Berlyn.' } />
            </div>
        </div>
    );
}

function FeelieLink({ url, text, width, height } : { url:string, text:string, width:number, height:number })
{
    return (
        <p className="Feelie">
            <a href={ './pic/'+url } target="_blank">
                <img src={ './pic/thumb/'+url } width={ width } height={ height } />
            </a>
            <br/>
            <a href={ './pic/'+url } target="_blank">{ text }</a>
        </p>
    )
}
