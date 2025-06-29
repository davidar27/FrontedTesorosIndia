import Button from "@/components/ui/buttons/Button";
import { Users, Plus, Minus } from "lucide-react";
import Input from "@/components/ui/inputs/Input";
interface PeopleCounterProps {
    people: number;
    setPeople: (people: number) => void;
    maxCapacity: number;
    error?: string;
    classNameButton?: string;
}

export const PeopleCounter = ({ people, setPeople, maxCapacity, error, classNameButton }: PeopleCounterProps) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-white flex items-center justify-center">
            <Users className="mr-2 h-4 w-4" />
            Número de personas
        </label>
        <div className="flex items-center gap-3 bg-white/30 rounded-xl p-2 justify-center">
            <Button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className={`rounded-full bg-white/20 text-white hover:bg-white/30 ${classNameButton}`}
                disabled={people <= 1}
                type="button"
                aria-label="Disminuir número de personas"
                title="Disminuir número de personas"
                aria-disabled={people <= 1}
                variant="success"
            >
                <Minus className="h-4 w-4" />
            </Button>
            <div className="text-center min-w-[60px]">

                <Input
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    className="w-fit text-center text-white bg-transparent !shadow-none border-none outline-none !p-0 "
                    inputMode="numeric"
                    min={1}
                    max={maxCapacity}
                />
                <div className="text-xs text-white/70">
                    {people === 1 ? 'persona' : 'personas'}
                </div>
            </div>
            <Button
                onClick={() => setPeople(Math.min(maxCapacity, people + 1))}
                className={`rounded-full bg-white/20 text-white hover:bg-white/30 ${classNameButton}`}
                // disabled={maxCapacity ? people >= maxCapacity : false}
                type="button"
                aria-label="Aumentar número de personas"
                title="Aumentar número de personas"
                aria-disabled={maxCapacity ? people >= maxCapacity : false}
                variant="success"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
        {maxCapacity === 0 && (
            <div className="pb-4"></div>
        )}


        {maxCapacity > 0 && (
            <p className="text-xs text-white/70 text-center ">
                Máximo: <span className="font-bold">{maxCapacity}</span> personas
            </p>
        )}
        {error && <p className="text-xs text-red-200">{error}</p>}
    </div>
);