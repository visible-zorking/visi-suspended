import React from 'react';
import { useContext, useState } from 'react';

import { robot_names, robot_ids, robot_ids_inv } from './info';
import { gamedat_ids, gamedat_object_ids, gamedat_roominfo_names } from '../visi/gamedat';
import { ObjectData } from '../visi/gametypes';
import { ZStatePlus } from '../visi/zstate';

import { GameMap, OptPosition, ScrollCenterInfo, ExtraToggle } from '../visi/map';
import { Commentary } from '../visi/widgets';
import { ObjListSorter } from './cwidgets';
import { SpecificSuspended } from './modgame';

// This is basically terrible but I'm don't have the energy to create an Effect
let currentFollowKey: number = 0;
let currentShowTransit: boolean = false;

export function GameMapBox()
{
    const [ followKey, setFollowKey ] = useState(0);
    const [ showTransit, setShowTransit ] = useState(false);

    currentFollowKey = followKey;
    currentShowTransit = showTransit;
    
    function evhan_transit_change() {
        currentShowTransit = !showTransit;
        setShowTransit(!showTransit);
        window.dispatchEvent(new CustomEvent('map-update', {}));
    }
    function setFollowKeyWrap(val: number) {
        currentFollowKey = val;
        setFollowKey(val);
        window.dispatchEvent(new CustomEvent('map-update', {}));
    }

    return (
        <div className="MapBox">
            <div className="MapTabBar">
                <Commentary topic="MAP-LEGEND" />
                <ObjListSorter followKey={ followKey } setFollowKey={ setFollowKeyWrap } />
                <div>
                    <input id="showtransit" type="checkbox" name="showtransit" onChange={ evhan_transit_change } />
                    <label htmlFor="showtransit">Show Transit Layer</label>
                </div>
            </div>
            <GameMap filename={ 'pic/map2.svg' } extras={ map_adjustments } scrollcenter={ scroll_center } />
        </div>
    );
}

function scroll_center(zstate:ZStatePlus, locname:string): ScrollCenterInfo
{
    let originobj: number = zstate.globals[114];  // WINNER
    if (currentFollowKey > 0) {
        originobj = robot_ids[currentFollowKey];
    }
    
    let mobroom = originobj;
    while (true) {
        let robj = zstate.objects[mobroom-1];
        if (!robj || robj.parent == 0 || robj.parent == gamedat_ids.ROOMS)
            break;
        mobroom = robj.parent;
    }
    if (mobroom && mobroom != originobj) {
        let roomdat = gamedat_object_ids.get(mobroom);
        if (roomdat) {
            return { room: roomdat.name };
        }
    }
    
    return null;
}

const room_offsets = [
    [ { x:0, y:-2 }, { x:0, y:-2 }, { x:0, y:-2 }, { x:0, y:-2 }, { x:0, y:-2 }, { x:0, y:-2 }, { x:0, y:-2 }, ], // UD-TUBE special case
    [ { x:0, y:1 }, ],
    [ { x:0, y:1 }, { x:0, y:-1 }, ],
    [ { x:0, y:1 }, { x:0.866, y:-0.5 }, { x:-0.866, y:-0.5 }, ],
    [ { x:0, y:1 }, { x:-1, y:0 }, { x:1, y:0 }, { x:0, y:-1 }, ],
    [ { x:0, y:1 }, { x:0.951, y:0.309 }, { x:0.587, y:-0.809 }, { x:-0.587, y:-0.809 }, { x:-0.951, y:0.309 }, ],
    [ { x:0, y:1 }, { x:0.866, y:0.5 }, { x:0.866, y:-0.5 }, { x:0, y:-1}, { x:-0.866, y:-0.5 }, { x:-0.866, y:0.5 }, ],
    [ { x:0, y:1 }, { x:0.866, y:0.5 }, { x:0.866, y:-0.5 }, { x:0, y:-1}, { x:-0.866, y:-0.5 }, { x:-0.866, y:0.5 }, { x:0, y:0 } ],
];

function map_adjustments(zstate: ZStatePlus): ExtraToggle[]
{
    let specifics = zstate.specifics as SpecificSuspended;
    
    let ls = [];

    let cla = currentShowTransit ? 'Visible' : 'Invisible';
    ls.push({ id:'frontdecorlayer', 'class':cla });

    let originobj: number = zstate.globals[114];  // WINNER
    let mobmap = new Map<number, number[]>();
    let moboffset = new Map<number, boolean>();

    for (let mobid of robot_ids) {
        if (!mobid)
            continue;
        let mobroom = mobid;
        while (true) {
            let robj = zstate.objects[mobroom-1];
            if (!robj || robj.parent == 0 || robj.parent == gamedat_ids.ROOMS)
                break;
            mobroom = robj.parent;
            // Check for the three conveyor belts.
            if (mobroom == 37 || mobroom == 38 || mobroom == 39)
                moboffset.set(mobid, true);
        }
        if (mobroom && mobroom != mobid) {
            var rls = mobmap.get(mobroom);
            if (!rls) {
                mobmap.set(mobroom, [ mobid ]);
            }
            else {
                rls.push(mobid);
            }

            let mobindex = robot_ids_inv[mobid];
            if (mobindex) {
                let mobdestroom = specifics.goaltables[mobindex][0];
                if (mobdestroom && mobdestroom != mobroom) {
                    // keep it
                }
                else {
                    mobdestroom = 0;
                }
                rls = mobmap.get(mobdestroom);
                if (!rls) {
                    mobmap.set(mobdestroom, [ mobid+1000 ]);
                }
                else {
                    rls.push(mobid+1000);
                }
            }
        }
    }

    for (let roomid of mobmap.keys()) {
        let rls = mobmap.get(roomid);
        if (!rls)
            continue;

        if (roomid == 0) {
            for (let mobid of rls) {
                if (mobid < 1000) {
                    let mobj = gamedat_object_ids.get(mobid);
                    if (!mobj) {
                        continue;
                    }
                    let mobkey = "mob-" + mobj.name.toLowerCase();
                    ls.push({ id:mobkey, class:'Offstage' });
                }
                else {
                    let mobj = gamedat_object_ids.get(mobid-1000);
                    if (!mobj) {
                        continue;
                    }
                    let mobkey = "mob-dest-" + mobj.name.toLowerCase();
                    ls.push({ id:mobkey, class:'Offstage' });
                }
            }
            continue;
        }

        let roomdat = gamedat_object_ids.get(roomid);
        if (!roomdat)
            continue;
        let throomobj = gamedat_roominfo_names.get(roomdat.name);
        if (!throomobj)
            continue;

        let offx = 0.25 * throomobj.width;
        let offy = 0.25 * throomobj.height;
        let offsets = room_offsets[rls.length];
        if (roomid == 139) // UD-TUBE
            offsets = room_offsets[0];
        
        let index = 0;
        for (let mobid of rls) {
            if (mobid < 1000) {
                let mobj = gamedat_object_ids.get(mobid);
                if (!mobj) {
                    continue;
                }
                let mobkey = "mob-" + mobj.name.toLowerCase();
                let mobcen: OptPosition = null;
                let mobloc: ObjectData|undefined;
                mobcen = throomobj.center;
                let offset = offsets[index];
                let robcen = { x:mobcen.x + offx*offset.x, y:mobcen.y + offy*offset.y };
                // Hacky offset when on a conveyor belt.
                if (moboffset.has(mobid))
                    robcen.x += 21;
                let mtransform = 'translate('+robcen.x+','+robcen.y+')';
                let cla = (mobid == originobj) ? '' : 'Noncurrent';
                ls.push({ id:mobkey, transform:mtransform, class:cla });
                index++;
            }
            else {
                let mobj = gamedat_object_ids.get(mobid-1000);
                if (!mobj) {
                    continue;
                }
                let mobkey = "mob-dest-" + mobj.name.toLowerCase();
                let mobcen: OptPosition = null;
                let mobloc: ObjectData|undefined;
                mobcen = throomobj.center;
                let offset = offsets[index];
                let robcen = { x:mobcen.x + offx*offset.x, y:mobcen.y + offy*offset.y };
                let mtransform = 'translate('+robcen.x+','+robcen.y+')';
                ls.push({ id:mobkey, transform:mtransform, class:'' });
                index++;
            }

        }
    }

    return ls;
}

