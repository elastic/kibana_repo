/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { left } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import type { TypeAndTimelineOnly } from './type_timeline_only_schema';
import { typeAndTimelineOnlySchema } from './type_timeline_only_schema';
import { exactCheck, foldLeftRight, getPaths } from '@kbn/securitysolution-io-ts-utils';

describe('prepackaged_rule_schema', () => {
  test('it should validate a a type and timeline_id together', () => {
    const payload: TypeAndTimelineOnly = {
      type: 'query',
      timeline_id: 'some id',
    };
    const decoded = typeAndTimelineOnlySchema.decode(payload);
    const checked = exactCheck(payload, decoded);
    const message = pipe(checked, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([]);
    expect(message.schema).toEqual(payload);
  });

  test('it should validate just a type without a timeline_id of type query', () => {
    const payload: TypeAndTimelineOnly = {
      type: 'query',
    };
    const decoded = typeAndTimelineOnlySchema.decode(payload);
    const checked = exactCheck(payload, decoded);
    const message = pipe(checked, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([]);
    expect(message.schema).toEqual(payload);
  });

  test('it should validate just a type of saved_query', () => {
    const payload: TypeAndTimelineOnly = {
      type: 'saved_query',
    };
    const decoded = typeAndTimelineOnlySchema.decode(payload);
    const checked = exactCheck(payload, decoded);
    const message = pipe(checked, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([]);
    expect(message.schema).toEqual(payload);
  });

  test('it should NOT validate an invalid type', () => {
    const payload: Omit<TypeAndTimelineOnly, 'type'> & { type: string } = {
      type: 'some other type',
    };
    const decoded = typeAndTimelineOnlySchema.decode(payload);
    const checked = exactCheck(payload, decoded);
    const message = pipe(checked, foldLeftRight);

    expect(getPaths(left(message.errors))).toEqual([
      'Invalid value "some other type" supplied to "type"',
    ]);
    expect(message.schema).toEqual({});
  });
});
