import { TSelectFilterBuilder } from './Types';

export function SelectFilterBuilder<T extends TSelectFilterBuilder>(
    filters: T
) {
    let result = `ORDER BY ${filters.field} ${filters.order ?? 'DESC'}`;
    if (filters.end) result += ` LIMIT BY ${filters.end}`;
    if (filters.start) result += ` START AT ${filters.start}`;
    return result;
}

export function FiltersObjectFromURL<T extends TSelectFilterBuilder>(
    url: string,
    hook?: (
        key: string,
        value: string
    ) => { key: string; value: string } | void
): T {
    const filters: T = {} as T;
    const entries = [...new URL(url).searchParams.entries()];

    entries.forEach((entry) => {
        const [key, value] = entry;
        
        switch (key) {
            case '_sort': {
                filters.field = JSON.stringify(value).slice(1, -1);
                break;
            }

            case '_order': {
                if (value != 'DESC' && value != 'ASC')
                    throw new Error(
                        'Given order is not compatible with `DESC | ASC`.'
                    );
                filters.order = value;
                break;
            }

            case '_start': {
                const v = parseInt(value);
                if (filters.end && filters.end < v)
                    throw new Error('Start cannot be greater than end');
                filters.start = v;
                break;
            }

            case '_end': {
                const v = parseInt(value);
                if (filters.start && filters.start > v)
                    throw new Error('Start cannot be greater than end');
                filters.end = v;
                break;
            }

            default: {
                if (!hook) break;
                const hookResult = hook(key, value);
                if (hookResult) {
                    const { key: hookKey, value: hookValue } = hookResult;
                    filters[hookKey] = hookValue;
                    break;
                }
            }
        }
    });

    if (filters.end && filters.start) filters.end -= filters.start;
    return filters;
}
