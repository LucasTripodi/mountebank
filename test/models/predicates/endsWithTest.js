'use strict';

const assert = require('assert'),
    predicates = require('../../../src/models/predicates');

describe('predicates', () => {
    describe('#endsWith', () => {
        it('should return false for request field not ending with expected', () => {
            const predicate = { endsWith: { field: 'middle' } },
                request = { field: 'begin middle end' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('should return true for request field starting with expected', () => {
            const predicate = { endsWith: { field: 'end' } },
                request = { field: 'begin middle end' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should be case insensitive by default', () => {
            const predicate = { endsWith: { field: 'END' } },
                request = { field: 'begin middle End' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should be allow for case isensitivity', () => {
            const predicate = { endsWith: { field: 'END' }, caseSensitive: true },
                request = { field: 'begin middle End' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('should match key-value pairs for objects', () => {
            const predicate = { endsWith: { headers: { field: 'end' } } },
                request = { headers: { field: 'begin middle end' } };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should return false if no key for object', () => {
            const predicate = { endsWith: { headers: { field: 'end' } } },
                request = { headers: {} };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('should return false if key for object does not ending with string', () => {
            const predicate = { endsWith: { headers: { field: 'begin' } } },
                request = { headers: { field: 'begin middle end' } };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('should return true if ends with binary sequence and encoding is base64', () => {
            const predicate = { endsWith: { field: new Buffer([2, 3, 4]).toString('base64') } },
                request = { field: new Buffer([1, 2, 3, 4]).toString('base64') };
            assert.ok(predicates.evaluate(predicate, request, 'base64'));
        });

        it('should return false if does not end with binary sequence and encoding is base64', () => {
            const predicate = { endsWith: { field: new Buffer([1, 2, 3]).toString('base64') } },
                request = { field: new Buffer([1, 2, 3, 4]).toString('base64') };
            assert.ok(!predicates.evaluate(predicate, request, 'base64'));
        });

        it('should return true if repeating query key has value ending with string', () => {
            const predicate = { endsWith: { query: { key: 'gin' } } },
                request = { query: { key: ['begin', 'middle', 'end'] } };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should return false if repeating query key does not have value ending with string', () => {
            const predicate = { endsWith: { query: { key: 'begi' } } },
                request = { query: { key: ['begin', 'middle', 'end'] } };
            assert.ok(!predicates.evaluate(predicate, request));
        });
    });
});
