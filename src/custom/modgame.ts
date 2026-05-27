import { unpack_address } from '../visi/gametypes';
import { GnustoEngine, ZState } from '../visi/zstate';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from '../visi/gamedat';

export type SpecificSuspended = {
    goaltables: number[][],
    followtbl: number[],
};

export function get_specifics(engine: GnustoEngine, state: ZState): SpecificSuspended
{
    // GOAL-TABLES
    let goaltables = [];
    for (let char=0; char<8; char++) {
        let goaltable = [];
        for (let ix=0; ix<16; ix += 2) {
            goaltable.push(engine.getUnsignedWord(9672 + 16*char + ix));
        }
        goaltables.push(goaltable);
    }
    
    // FOLLOW-TBL
    let followtbl = [];
    for (let char=0; char<6; char++) {
        followtbl.push(engine.getUnsignedWord(9646 + 2*char));
    }
    
    return {
        goaltables: goaltables,
        followtbl: followtbl,
    };
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

