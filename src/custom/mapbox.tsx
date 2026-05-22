import React from 'react';
import { useContext, useState } from 'react';

import { GameMap } from '../visi/map';
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
            <GameMap />
        </div>
    );
}
