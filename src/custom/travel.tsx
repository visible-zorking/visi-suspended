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
		ABOUT...
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
            <GoalTableRow key={ char } char={ char } row={ specifics.goaltables[char] } />
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
                    <th>dir</th>
                    <th>run</th>
                </tr>
                { rowls }
            </tbody>
        </table>
    );
}

function GoalTableRow({ char,  row }: { char:number, row:number[] })
{
    let rctx = useContext(ReactCtx);

    let obj0 = gamedat_object_ids.get(row[0]);
    let obj1 = gamedat_object_ids.get(row[1]);
    let obj2 = gamedat_object_ids.get(row[2]);
    
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
                    row[2] ?
			<span>{ row[2] }</span>
                    : '\u2014'
                }
            </td>
            <td>
                &#x2014;
            </td>
            <td>
                { (row[4] ?
                   <span className="TimerActive">&#x2611;</span> :
                   <span className="TimerInactive">&#x2610;</span>) }
            </td>
        </tr>
    )
}
