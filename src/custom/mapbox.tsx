import React from 'react';
import { useContext, useState } from 'react';

import { robot_names, robot_ids } from './info';
import { gamedat_ids, gamedat_object_ids, gamedat_roominfo_names } from '../visi/gamedat';
import { ObjectData } from '../visi/gametypes';
import { ZStatePlus } from '../visi/zstate';

import { GameMap, OptPosition, ExtraToggle } from '../visi/map';
import { ObjListSorter } from './cwidgets';

export function GameMapBox()
{
    const [ followKey, setFollowKey ] = useState(0);
    const [ showTransit, setShowTransit ] = useState(false);

    function evhan_transit_change() {
        setShowTransit(!showTransit);
    }

    return (
        <div className="MapBox">
            <div className="MapTabBar">
                <ObjListSorter followKey={ followKey } setFollowKey={ setFollowKey } />
                <div>
                    <input id="showtransit" type="checkbox" name="showtransit" onChange={ evhan_transit_change } />
                    <label htmlFor="showtransit">Show Transit Layer</label>
                </div>
            </div>
            <GameMap extras={ map_adjustments } />
        </div>
    );
}

function map_adjustments(zstate: ZStatePlus): ExtraToggle[]
{
    let ls = [];

    let mobmap = new Map<number, number[]>();

    for (let mobid of robot_ids) {
        if (!mobid)
            continue;
        let mobroom = mobid;
        while (true) {
            let robj = zstate.objects[mobroom-1];
            if (!robj || robj.parent == 0 || robj.parent == gamedat_ids.ROOMS)
                break;
            mobroom = robj.parent;
        }
        if (mobroom && mobroom != mobid) {
            var rls = mobmap.get(mobroom);
            if (!rls) {
                mobmap.set(mobroom, [ mobid ]);
            }
            else {
                rls.push(mobid);
            }
        }
    }
    
    for (let mobid of robot_ids) {
        if (!mobid) {
            continue;
        }
        let mobj = gamedat_object_ids.get(mobid);
        if (!mobj) {
            continue;
        }
        let mobkey = "mob-" + mobj.name.toLowerCase();
        let mobcen: OptPosition = null;
        let mobloc: ObjectData|undefined;
        let zobj = zstate.objects[mobid-1];
        if (zobj.parent) {
            mobloc = gamedat_object_ids.get(zobj.parent);
            if (mobloc) {
                let throomobj = gamedat_roominfo_names.get(mobloc.name);
                if (throomobj) {
                    mobcen = throomobj.center;
                }
            }
        }
        if (mobcen) {
            let robcen = { x:mobcen.x, y:mobcen.y+5 };
            let mtransform = 'translate('+robcen.x+','+robcen.y+')';
            ls.push({ id:mobkey, transform:mtransform });
        }
    }

    return ls;
}

