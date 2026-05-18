import React from 'react';
import { useState, useContext, createContext } from 'react';

import { ZObject } from '../visi/zstate';
import { ObjectData, GlobalData } from '../visi/gametypes';
import { ReactCtx, StackCallCtx } from '../visi/context';
import { ArgShowObject, ArgShowProperty } from '../visi/actshowers';
import { VarShowString } from '../visi/globshow';
import { gamedat_ids, gamedat_distances, gamedat_object_treesort, gamedat_objproptable_addrs } from '../visi/gamedat';
import { robot_names } from './info';

export function contains_label(obj: ObjectData) : string
{
    if (!obj.isroom) {
        if (obj.onum == gamedat_ids.PEOPLE)
            return 'carries';
        else
            return 'contains'
    }
    return '';
}

export function sorter_for_key(key: number) : (roots:ZObject[], map:Map<number, ZObject>) => void
{
    let originobj: number = gamedat_ids.ADVENTURER; //### pick-a-bot

    return function(roots: ZObject[], map: Map<number, ZObject>) {
        let advroom = originobj;

        while (true) {
            let tup = map.get(advroom);
            if (!tup || tup.parent == 0 || tup.parent == gamedat_ids.ROOMS)
                break;
            advroom = tup.parent;
        }
        
        if (!gamedat_distances[advroom])
            advroom = gamedat_ids.STARTROOM;
        let distmap = gamedat_distances[advroom];

        roots.sort((o1, o2) => {
            let sort1 = gamedat_object_treesort.get(o1.onum) ?? 0;
            let sort2 = gamedat_object_treesort.get(o2.onum) ?? 0;
            if (sort1 != sort2)
                return sort1 - sort2;
            if (sort1 == 1 && distmap !== undefined)
                return distmap[o1.onum] - distmap[o2.onum];
            return (o1.onum - o2.onum);
        });
    }
}

export function ObjListSorter({ followKey, setFollowKey } : { followKey:number, setFollowKey:(v:number)=>void })
{
    return (
        <div>
            (Following Adventurer)
        </div>
    );
}

export function global_value_display(tag: string, value: number, glo: GlobalData) : JSX.Element|null
{
    switch (tag) {
        
    case 'ROBOTNUM':
        return (
            <VarShowRobotNum value={ value } />
        );
        
    }
    
    return null;
}

export function property_value_display(tag: string, values: number[]) : JSX.Element|null
{
    switch (tag) {
        
    case 'CORBITS':
        return (
            <VarShowCorridorBits value={ values[0]*0x100+values[1] } />
        )
        
    case 'ROBOTNUM':
        return (
            <VarShowRobotNum value={ values[0]*0x100+values[1] } />
        )
        
    case 'CLCTXT':
        return (
            <PropShowCLCText value={ values[0]*0x100+values[1] } />
        )
    }
    
    return null;
}

export function stack_call_arg_display(tag: string, value: number) : JSX.Element|null
{
    switch (tag) {
        
    case 'PERFORMO':
        let ctx = useContext(StackCallCtx);
        if (ctx.args[0] == 106) {      /* action WALK */
            return (
                <ArgShowProperty value={ value } />
            );
        }
        return (
            <ArgShowObject value={ value } />
        )
        
    case 'PERFORMI':
        return (
            <ArgShowObject value={ value } />
        )
    }

    return null;
}

export function VarShowRobotNum({ value }: { value:number })
{
    if (value < robot_names.length) {
        return (
            <span>{ value }:<i>{ robot_names[value].toLowerCase() }</i></span>
        );
    }
    
    return (
        <span>{ value }:???</span>
    );
}

export function VarShowCorridorBits({ value }: { value:number })
{
    let ls: string[] = [];

    for (let bit=1; bit < 65536; bit *= 2) {
        if (value & bit)
            ls.push(''+bit);
    }

    if (!ls.length)
        ls.push('0');
    
    let str = ls.join(',');
    
    return (
        <i>cor-{ str }</i>
    );
}

export function PropShowCLCText({ value }: { value:number })
{
    let rctx = useContext(ReactCtx);
    let table = gamedat_objproptable_addrs.get(value);

    if (!table || !table.values) {
        return (
            <i>???{ value }</i>
        );
    }

    const labels = ['Tech', 'Advi', 'Hist'];

    let counter = 0;
    let rowls: JSX.Element[] = []
    for (let val of table.values) {
        if (val) {
            rowls.push(
                <li key={ counter }>
                    <span className="IndexLabel">{ labels[counter] }:</span>
                    {' '}<VarShowString value={ val } />
                </li>
            );
        }
        counter++;
    }
    
    return (
        <>
            { (rctx.shownumbers ?
               <span className="ShowAddr">({ value })</span>
               : null) }
            <ul className="IndexTextList">{ rowls }</ul>
        </>
    );
}
