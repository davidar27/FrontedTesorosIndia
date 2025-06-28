import Button from "@/components/ui/buttons/Button";
import { FormField } from "../handleFastPackage";



export const PeopleCounter = ({ people, setPeople, maxCapacity, error }) => (
    <FormField label="Número de personas" error={error} required>
        <div className="flex items-center gap-3">
            <Button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                disabled={people <= 1}
                aria-label="Disminuir personas"
            >
                -
            </Button>
            <div className="text-center min-w-[60px]">
                <div className="text-lg font-semibold">{people}</div>
                <div className="text-xs text-gray-500">
                    {people === 1 ? 'persona' : 'personas'}
                </div>
            </div>
            <Button
                onClick={() => setPeople(Math.min(maxCapacity || 20, people + 1))}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                disabled={people >= maxCapacity}
                aria-label="Aumentar personas"
            >
                +
            </Button>
        </div>
        {maxCapacity && (
            <p className="text-xs text-gray-500 mt-1">
                Máximo: {maxCapacity} personas
            </p>
        )}
    </FormField>
);