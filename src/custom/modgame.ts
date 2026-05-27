import { unpack_address } from '../visi/gametypes';
import { GnustoEngine, ZState } from '../visi/zstate';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from '../visi/gamedat';

export type SpecificSuspended = {
    goaltables: number[][],
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
    
    return {
        goaltables: goaltables,
    };
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

