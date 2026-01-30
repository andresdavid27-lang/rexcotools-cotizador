'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface SearchInputProps<T> {
    data: T[];
    placeholder?: string;
    onSelect: (item: T) => void;
    displayValue: (item: T) => string;
    filter: (item: T, query: string) => boolean;
    label?: string;
    className?: string; // Add className prop
}

export function SearchInput<T>({
    data,
    placeholder,
    onSelect,
    displayValue,
    filter,
    label,
    className,
}: SearchInputProps<T>) {
    const [query, setQuery] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [filteredData, setFilteredData] = React.useState<T[]>([]);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (query.trim() === '') {
            setFilteredData([]);
            return;
        }
        const results = data.filter((item) => filter(item, query));
        setFilteredData(results);
    }, [query, data, filter]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item: T) => {
        onSelect(item);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div className={cn("relative w-full", className)} ref={containerRef}>
            {label && <label className="mb-2 block text-sm font-medium">{label}</label>}
            <div className="relative">
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="pr-10"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>

            {isOpen && filteredData.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
                    {filteredData.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(item)}
                            className="cursor-pointer px-4 py-2 hover:bg-cyan-50 text-sm"
                        >
                            {displayValue(item)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
