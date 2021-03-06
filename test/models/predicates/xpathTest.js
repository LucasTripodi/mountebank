'use strict';

const assert = require('assert'),
    predicates = require('../../../src/models/predicates');

describe('predicates', () => {
    describe('xpath', () => {
        it('#equals should be false if field is not XML', () => {
            const predicate = {
                    equals: { field: 'VALUE' },
                    xpath: { selector: '//title' }
                },
                request = { field: 'VALUE' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#equals should be false if field is empty', () => {
            const predicate = {
                    equals: { field: 'VALUE' },
                    xpath: { selector: '//title' }
                },
                request = { field: '' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#equals should be true if value in provided xpath expression', () => {
            const predicate = {
                    equals: { field: 'VALUE' },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>value</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#equals should be false if value provided xpath expression does not equal', () => {
            const predicate = {
                    equals: { field: 'NOT VALUE' },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>value</title></doc>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#equals should use case-insensitive xpath selector by default', () => {
            const predicate = {
                    equals: { field: 'VALUE' },
                    xpath: { selector: '//Title' }
                },
                request = { field: '<DOC><TITLE>value</TITLE></DOC>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#equals should not equal if case-sensitive xpath selector does not match', () => {
            const predicate = {
                    equals: { field: 'value' },
                    xpath: { selector: '//Title' },
                    caseSensitive: true
                },
                request = { field: '<DOC><TITLE>value</TITLE></DOC>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#equals should equal if case-sensitive xpath selector matches', () => {
            const predicate = {
                    equals: { field: 'value' },
                    xpath: { selector: '//Title' },
                    caseSensitive: true
                },
                request = { field: '<Doc><Title>value</Title></Doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#equals should equal if case-sensitive xpath selector matches, stripping out the exception', () => {
            const predicate = {
                    equals: { field: 've' },
                    xpath: { selector: '//Title' },
                    caseSensitive: true,
                    except: 'alu'
                },
                request = { field: '<Doc><Title>value</Title></Doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#equals should not equal if case-sensitive xpath selector matches, but stripped values differ', () => {
            const predicate = {
                    equals: { field: 'v' },
                    xpath: { selector: '//Title' },
                    caseSensitive: true,
                    except: 'alu'
                },
                request = { field: '<Doc><Title>value</Title></Doc>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#deepEquals should be false if field is not XML and xpath selector used', () => {
            const predicate = {
                    deepEquals: { field: 'VALUE' },
                    xpath: { selector: '//title' }
                },
                request = { field: 'VALUE' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#deepEquals should equal value in provided xpath attribute', () => {
            const predicate = {
                    deepEquals: { field: 'VALUE' },
                    xpath: { selector: '//title/@href' }
                },
                request = { field: '<doc><title href="value">text</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#deepEquals should be false if value in provided xpath attribute expression does not equal', () => {
            const predicate = {
                    deepEquals: { field: 'NOT VALUE' },
                    xpath: { selector: '//title/@attr' }
                },
                request = { field: '<doc><title attr="value">text</title></doc>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#deepEquals should be true if all values in a multi-value selector match are present', () => {
            const predicate = {
                    deepEquals: { field: ['first', 'second'] },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>first</title><title>second</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#deepEquals should be false if some values in a multi-value selector match are missing', () => {
            const predicate = {
                    deepEquals: { field: ['first', 'second'] },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>first</title><title>second</title><title>third</title></doc>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#deepEquals should be true if values in a multi-value selector match are out of order', () => {
            const predicate = {
                    deepEquals: { field: ['first', 'second'] },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>second</title><title>first</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#contains should be true if direct text value contains predicate', () => {
            const predicate = {
                    contains: { field: 'value' },
                    xpath: { selector: '//title/text()' }
                },
                request = { field: '<doc><title>this is a value</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#contains should be false if direct text value does not contain predicate', () => {
            const predicate = {
                    contains: { field: 'VALUE' },
                    xpath: { selector: '//title/text()' },
                    caseSensitive: true
                },
                request = { field: '<doc><title>this is a value</title></doc>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#startsWith should be true if direct namespaced xpath selection starts with value', () => {
            const predicate = {
                    startsWith: { field: 'Harry' },
                    xpath: { selector: '//*[local-name(.)="title" and namespace-uri(.)="myns"]' }
                },
                request = { field: '<book><title xmlns="myns">Harry Potter</title></book>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#startsWith should be false if direct namespaced xpath selection does not start with value', () => {
            const predicate = {
                    startsWith: { field: 'Potter' },
                    xpath: { selector: '//*[local-name(.)="title" and namespace-uri(.)="myns"]' }
                },
                request = { field: '<book><title xmlns="myns">Harry Potter</title></book>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#startsWith should be false if direct namespaced xpath selection does not match', () => {
            const predicate = {
                    startsWith: { field: 'Harry' },
                    xpath: { selector: '//*[local-name(.)="title" and namespace-uri(.)="myns"]' }
                },
                request = { field: '<book><title>Harry Potter</title></book>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#endsWith should be true if aliased namespace match endsWith predicate', () => {
            const predicate = {
                    endsWith: { field: 'Potter' },
                    xpath: {
                        selector: '//bookml:title/text()',
                        ns: {
                            bookml: 'http://example.com/book'
                        }
                    }
                },
                request = { field: '<book xmlns:bookml="http://example.com/book"><bookml:title>Harry Potter</bookml:title></book>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#endsWith should be true if aliased namespace match but has capital letters in URL', () => {
            const predicate = {
                    endsWith: { field: 'Potter' },
                    xpath: {
                        selector: '//bookml:title/text()',
                        ns: {
                            bookml: 'http://EXAMPLE.COM/book'
                        }
                    }
                },
                request = { field: '<book xmlns:bookml="http://EXAMPLE.COM/book"><bookml:title>Harry Potter</bookml:title></book>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#equals should be true if caseSensitive and namespace has capital letters in URL', () => {
            const predicate = {
                    equals: { field: 'Harry Potter' },
                    caseSensitive: true,
                    xpath: {
                        selector: '//bookml:title/text()',
                        ns: { bookml: 'http://EXAMPLE.COM/book' }
                    }
                },
                request = { field: '<book xmlns:bookml="http://EXAMPLE.COM/book"><bookml:title>Harry Potter</bookml:title></book>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#endsWith should be false if aliased namespace match does not end with predicate', () => {
            const predicate = {
                    endsWith: { field: 'Harry' },
                    xpath: {
                        selector: '//bookml:title/text()',
                        ns: {
                            bookml: 'http://example.com/book'
                        }
                    }
                },
                request = { field: '<b:book xmlns:b="http://example.com/book"><b:title>Harry Potter</b:title></b:book>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#equals should be true if any matched node equals the predicate value', () => {
            const predicate = {
                    equals: { field: 'Second' },
                    xpath: {
                        selector: '//a:child',
                        ns: {
                            a: 'http://example.com/a',
                            b: 'http://example.com/b'
                        }
                    }
                },
                request = {
                    field: '<root xmlns:thisa="http://example.com/a" xmlns:thisb="http://example.com/b">' +
                    '  <thisa:child>First</thisa:child>' +
                    '  <thisa:child>Second</thisa:child>' +
                    '  <thisa:child>Third</thisa:child>' +
                    '</root>'
                };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#equals should be false if no nodes match the selector', () => {
            // despite namespace aliases matching, urls do not
            const predicate = {
                    equals: { field: 'Second' },
                    xpath: {
                        selector: '//a:child',
                        ns: {
                            a: 'http://example.com/a',
                            b: 'http://example.com/b'
                        }
                    }
                },
                request = {
                    field: '<root xmlns:b="http://example.com/a" xmlns:a="http://example.com/b">' +
                    '  <a:child>First</a:child>' +
                    '  <a:child>Second</a:child>' +
                    '  <a:child>Third</a:child>' +
                    '</root>'
                };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#matches should be false if field is not XML', () => {
            const predicate = {
                    matches: { field: 'VALUE' },
                    xpath: { selector: '//title' }
                },
                request = { field: 'VALUE' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('#matches should be true if selected value matches regex', () => {
            const predicate = {
                    matches: { field: '^v' },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>value</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#matches should be false if selected value does not match regex', () => {
            const predicate = {
                    matches: { field: 'v$' },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>value</title></doc>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('should throw an error if encoding is base64', () => {
            try {
                const predicate = {
                        equals: { field: 'dGVzdA==' },
                        xpath: { selector: 'dGVzdA==' }
                    },
                    request = { field: 'dGVzdA==' };
                predicates.evaluate(predicate, request, 'base64');
                assert.fail('should have thrown');
            }
            catch (error) {
                assert.strictEqual(error.code, 'bad data');
                assert.strictEqual(error.message, 'the xpath predicate parameter is not allowed in binary mode');
            }
        });

        it('#exists should be true if xpath selector has at least one result', () => {
            const predicate = {
                    exists: { field: true },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><title>value</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#exists should be false if xpath selector does not match', () => {
            const predicate = {
                    exists: { field: true },
                    xpath: { selector: '//title' }
                },
                request = { field: '<doc><summary>value</summary></doc>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('should throw error if xpath selector is malformed', () => {
            try {
                const predicate = {
                        equals: { field: 'value' },
                        xpath: { selector: '=*INVALID*=' }
                    },
                    request = { field: '<doc><title>value</title></doc>' };
                predicates.evaluate(predicate, request);
                assert.fail('should have thrown');
            }
            catch (error) {
                assert.strictEqual(error.code, 'bad data');
                assert.strictEqual(error.message, 'malformed xpath predicate selector');
            }
        });

        it('should accept numbers using count()', () => {
            const predicate = {
                    equals: { field: 2 },
                    xpath: { selector: 'count(//title)' }
                },
                request = { field: '<doc><title>first</title><title>second</title></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should accept booleans returning false', () => {
            const predicate = {
                    equals: { field: false },
                    xpath: { selector: 'boolean(//title)' }
                },
                request = { field: '<doc></doc>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should return true if node exists even if no data in the node (issue #163)', () => {
            const predicate = {
                    exists: { field: true },
                    xpath: { selector: '//book' }
                },
                request = { field: '<books><book></book></books>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should return false if node does not exist (issue #163)', () => {
            const predicate = {
                    exists: { field: true },
                    xpath: { selector: '//book' }
                },
                request = { field: '<books></books>' };
            assert.ok(!predicates.evaluate(predicate, request));
        });

        it('should return true if node exists with child node data (issue #163)', () => {
            const predicate = {
                    exists: { field: true },
                    xpath: { selector: '//book' }
                },
                request = { field: '<books><book><title>Game of Thrones</title></book></books>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('should support array predicates', () => {
            const predicate = {
                    equals: { field: ['first', 'third', 'second'] },
                    xpath: { selector: '//value' }
                },
                request = { field: '<values><value>first</value><value>second</value><value>third</value></values>' };
            assert.ok(predicates.evaluate(predicate, request));
        });

        it('#matches without case sensitivity should maintain selector to match XML (test for issue #361, already worked)', () => {
            const predicate = {
                    matches: { body: '111\\.222\\.333\\.*' },
                    xpath: { selector: '/ipAddress' }
                },
                request = { body: '<ipAddress>111.222.333.456</ipAddress>' };
            assert.ok(predicates.evaluate(predicate, request));
        });
    });
});
