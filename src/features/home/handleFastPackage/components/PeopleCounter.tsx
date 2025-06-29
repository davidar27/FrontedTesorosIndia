import Button from "@/components/ui/buttons/Button";

interface PeopleCounterProps {
    people: number;
    setPeople: (people: number) => void;
    maxCapacity: number;
    error?: string;
}

export const PeopleCounter = ({ people, setPeople, maxCapacity, error }: PeopleCounterProps) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-white">
            Número de personas
        </label>
        <div className="flex items-center gap-3 bg-white/30 rounded-xl p-2 justify-center">
            <Button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className=" rounded-full bg-white/20 text-white hover:bg-white/30"
                disabled={people <= 1}
                type="button"
                aria-label="Disminuir número de personas"
                title="Disminuir número de personas"
                aria-disabled={people <= 1}
                variant="success"
            >
                -
            </Button>
            <div className="text-center min-w-[60px]">
                <div className="text-lg font-semibold text-white">{people}</div>
                <div className="text-xs text-white/70">
                    {people === 1 ? 'persona' : 'personas'}
                </div>
            </div>
            <Button
                onClick={() => setPeople(Math.min(maxCapacity, people + 1))}
                className=" rounded-full bg-white/20 text-white hover:bg-white/30"
                disabled={maxCapacity ? people >= maxCapacity : false}
                type="button"
                aria-label="Aumentar número de personas"
                title="Aumentar número de personas"
                aria-disabled={maxCapacity ? people >= maxCapacity : false}
                variant="success"

            >
                +
            </Button>
        </div>
        {maxCapacity === 0 && (
            <div className="pb-4"></div>
        )}
        {maxCapacity > 0 && (
            <p className="text-xs text-white/70">
                Máximo: {maxCapacity} personas
            </p>
        )}
        {error && <p className="text-xs text-red-200">{error}</p>}
    </div>
);