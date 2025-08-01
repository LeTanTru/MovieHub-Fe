import { FieldValues, Path } from 'react-hook-form';

type FieldError = { type: string; message: string };

type ErrorMaps<TFields extends FieldValues> = Record<
  string,
  Array<[Path<TFields>, FieldError]>
>;

export type { FieldError, ErrorMaps };
