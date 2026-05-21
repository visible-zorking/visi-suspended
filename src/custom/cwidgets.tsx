import React from 'react';
import { useState, useContext, createContext } from 'react';

import { ZStatePlus, ZObject } from '../visi/zstate';
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

export function sorter_for_key(key: number, zstate: ZStatePlus) : (roots:ZObject[], map:Map<number, ZObject>) => void
{
    let originobj: number = zstate.globals[114];  // WINNER
    const followObjs = [ 0, gamedat_ids.IRIS, gamedat_ids.WALDO, gamedat_ids.SENSA, gamedat_ids.AUDA, gamedat_ids.POET, gamedat_ids.WHIZ, gamedat_ids.PEOPLE ];
    if (key) {
        originobj = followObjs[key];
    }

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
    let follow: string = 'auto';
    const followKeys = ['auto', 'iris', 'waldo', 'sensa', 'auda', 'poet', 'whiz', 'people'];
    if (followKey >= 0 && followKey < followKeys.length)
        follow = followKeys[followKey];
    
    function evhan_follow_change(val: string) {
        switch (val) {
        case 'auto':
            setFollowKey(0);
            break;
        case 'iris':
            setFollowKey(1);
            break;
        case 'waldo':
            setFollowKey(2);
            break;
        case 'sensa':
            setFollowKey(3);
            break;
        case 'auda':
            setFollowKey(4);
            break;
        case 'poet':
            setFollowKey(5);
            break;
        case 'whiz':
            setFollowKey(6);
            break;
        case 'people':
            setFollowKey(7);
            break;
        }
    }
    
    return (
        <div className="RobotSelector">
            Follow{' '}
            <input id="followauto_radio" type="radio" name="follow" value="auto" checked={ follow=='auto' } onChange={ (ev) => evhan_follow_change('auto') } />
            <label htmlFor="followauto_radio">Auto</label>{' '}
            <input id="followiris_radio" type="radio" name="follow" value="iris" checked={ follow=='iris' } onChange={ (ev) => evhan_follow_change('iris') } />
            <label htmlFor="followiris_radio">Iris</label>
            <input id="followwaldo_radio" type="radio" name="follow" value="waldo" checked={ follow=='waldo' } onChange={ (ev) => evhan_follow_change('waldo') } />
            <label htmlFor="followwaldo_radio">Waldo</label>
            <input id="followsensa_radio" type="radio" name="follow" value="sensa" checked={ follow=='sensa' } onChange={ (ev) => evhan_follow_change('sensa') } />
            <label htmlFor="followsensa_radio">Sensa</label>
            <input id="followauda_radio" type="radio" name="follow" value="auda" checked={ follow=='auda' } onChange={ (ev) => evhan_follow_change('auda') } />
            <label htmlFor="followauda_radio">Auda</label>
            <input id="followpoet_radio" type="radio" name="follow" value="poet" checked={ follow=='poet' } onChange={ (ev) => evhan_follow_change('poet') } />
            <label htmlFor="followpoet_radio">Poet</label>
            <input id="followwhiz_radio" type="radio" name="follow" value="whiz" checked={ follow=='whiz' } onChange={ (ev) => evhan_follow_change('whiz') } />
            <label htmlFor="followwhiz_radio">Whiz</label>
            <input id="followpeople_radio" type="radio" name="follow" value="people" checked={ follow=='people' } onChange={ (ev) => evhan_follow_change('people') } />
            <label htmlFor="followpeople_radio">Humans</label>
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
        
    case 'ROOMDESCS':
        return (
            <PropShowRoomDescs value={ values[0]*0x100+values[1] } />
        )
        
    case 'OBJDESCS':
        return (
            <PropShowObjDescs value={ values[0]*0x100+values[1] } />
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

export function PropShowRoomDescs({ value }: { value:number })
{
    let rctx = useContext(ReactCtx);
    let table = gamedat_objproptable_addrs.get(value);

    if (!table || !table.values) {
        return (
            <i>???{ value }</i>
        );
    }

    let counter = 0;
    let rowls: JSX.Element[] = [];
    for (let val of table.values) {
        if (val) {
            rowls.push(
                <li key={ counter }>
                    <span className="IndexLabel">{ robot_names[counter+1] }:</span>
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

export function PropShowObjDescs({ value }: { value:number })
{
    let rctx = useContext(ReactCtx);
    let table = gamedat_objproptable_addrs.get(value);

    if (!table || !table.values) {
        return (
            <i>???{ value }</i>
        );
    }
    
    return (
        <>
            { (rctx.shownumbers ?
               <span className="ShowAddr">({ value })</span>
               : null) }
            <ul className="IndexGroupList">
                <RobotStringList arr={ table.values.slice(0, 6) } label="Describe" />
                <RobotStringList arr={ table.values.slice(6, 12) } label="Name" />
                <RobotStringList arr={ table.values.slice(12, 18) } label="Examine" />
            </ul>
        </>
    );
}

function RobotStringList({ arr, label }: { arr:number[], label:string })
{
    let map: { [key: number]: number[] } = {};
    let keys: number[] = [];

    let index = 0;
    for (let val of arr) {
        if (val) {
            if (!map[val]) {
                map[val] = [ index ];
                keys.push(val);
            }
            else {
                map[val].push(index);
            }
        }
        index++;
    }

    if (keys.length == 0)
        return null;

    let rowls = keys.map((val) => {
        let indexes = map[val];
        let label = 'ALL';
        if (indexes.length < 6) {
            let rls = indexes.map((index) => robot_names[index+1]);
            label = rls.join(', ');
        }
        if (val == 1) {
            return (
                <li key={ val }>
                    <span className="IndexLabel">{ label }:</span>{' '}
                    <i>default</i>
                </li>
            );
        }
        else {
            return (
                <li key={ val }>
                    <span className="IndexLabel">{ label }:</span>{' '}
                    <VarShowString value={ val } />
                </li>
            );
        }
    });

    return (
        <>
            <li className="IndexGroupLabel">{ label }:</li>
            <ul className="IndexTextList">
                { rowls }
            </ul>
        </>
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

    const labels = ['TECH', 'ADVI', 'HIST'];

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
