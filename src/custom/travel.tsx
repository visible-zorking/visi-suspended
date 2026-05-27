import React from 'react';
import { useState, useContext } from 'react';

import { ZilSourceLoc } from '../visi/main';
import { ReactCtx } from '../visi/context';

import { signed_zvalue, unpack_address } from '../visi/gametypes';
import { gamedat_object_ids, gamedat_routine_addrs, gamedat_property_nums } from '../visi/gamedat';

import { robot_names } from './info';
import { SpecificSuspended } from './modgame';


// This doesn't require a context, turns out.
function evhan_click_id(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) {
    ev.preventDefault();
    let dat: ZilSourceLoc = { id: id, commentary: true };
    window.dispatchEvent(new CustomEvent('zil-source-location', { detail:dat }));
}

export function TravelPage()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;
    
    return (
        <div className="ScrollContent">
            <p>
                <em>Suspended</em> borrows the NPC movement system that
                was invented for <em>Deadline</em>. However, it is rather
                simpler here, because the robots don&#x2019;t have
                their own movement schedule. They only obey orders.
            </p>
            <p>
                (The humans <em>do</em> have their own movement schedule,
                but it&#x2019;s not managed by a table like in{' '}
                <em>Deadline</em>. It&#x2019;s a nest of interlocking timers.)
            </p>
            <p>
                To manage character movement, the game defines six
                &#x201C;<a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:A-LINE') }>transit lines</a>&#x201D;
                that run through the map.
                Every room is either a &#x201C;station&#x201D;
                on one of these lines, or adjacent to a station room.
                Thus, to reach a goal, an NPC just needs to
                (1) move to the local station if needed;
                (2) move one step along the current line to the next
                interchange;
                (3) if on the goal line, move one step towards the
                goal station;
                (4) move to the final room (if that&#x2019;s not the station).
            </p>
            <p>
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:GOAL-TABLES') }><code>GOAL-TABLES</code></a>{' '}
                shows each robot&#x2019;s current movement goal.
                &#x201C;Final&#x201D; is where they are heading;
                &#x201C;station&#x201D; is that room&#x2019;s{' '}
                <code>STATION</code>;
                &#x201C;inter&#x201D; is an index into{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:TRANSFER-TABLE') }><code>TRANSFER-TABLE</code></a>{' '}
                indicating the transfer point to the next line.
                The &#x201C;run&#x201D; column is whether the
                character&#x2019;s movement is enabled. (Always,
                in this game.)
            </p>
            <p>
                The &#x201C;follow&#x201D; column is a separate table
                (<a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:FOLLOW-TBL') }><code>FOLLOW-TBL</code></a>)
                that shows when one robot is told to
                {' '}<code>FOLLOW</code> another.
                (I've combined the tables here for simplicity.)
            </p>
            <GoalTable />
        </div>
    );
}

function GoalTable()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;
    
    let specifics = zstate.specifics as SpecificSuspended;
    
    let rowls = [];
    for (let char=1; char<=7; char++) {
        rowls.push(
            <GoalTableRow key={ char } char={ char } row={ specifics.goaltables[char] } follow={ specifics.followtbl[char-1] } />
        );
    }
    
    return (
        <table className="GoalTable">
            <tbody>
                <tr>
                    <th>robot</th>
                    <th>final</th>
                    <th>station</th>
                    <th>inter</th>
                    <th>run</th>
                    <th>follow</th>
                </tr>
                { rowls }
            </tbody>
        </table>
    );
}

function GoalTableRow({ char, row, follow }: { char:number, row:number[], follow:number })
{
    let rctx = useContext(ReactCtx);

    let obj0 = gamedat_object_ids.get(row[0]);
    let obj1 = gamedat_object_ids.get(row[1]);
    let objf = gamedat_object_ids.get(follow);
    
    return (
        <tr>
            <td>{ robot_names[char] }</td>
            <td>
                {
                    obj0 ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+obj0.name) }>{ obj0.name }</a>
                    : '\u2014'
                }
            </td>
            <td>
                {
                    obj1 ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+obj1.name) }>{ obj1.name }</a>
                    : '\u2014'
                }
            </td>
            <td>
                {
                    obj0 ?
                        <span>{ row[2] }</span>
                    : '\u2014'
                }
            </td>
            <td>
                { (row[4] ?
                   <span className="TimerActive">&#x2611;</span> :
                   <span className="TimerInactive">&#x2610;</span>) }
            </td>
            <td>
                {
                    objf ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+objf.name) }>{ objf.name }</a>
                    : '\u2014'
                }
            </td>
        </tr>
    )
}
