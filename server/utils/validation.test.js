const expect = require('expect');
//import isRealString
const { isRealString } = require('./validation')

//isRealString
    //should reject non-string values
    //should reject string with only spaces
    //should allow strings with non-space characters

    describe('isRealString', () => {
        it('should reject non-string values', () => {
            const res = isRealString(98);
            expect(res).toBe(false);
        });

        it('should reject string with only spaces', () => {
            const res = isRealString('    ');
            expect(res).toBe(false);
        });

        it('should allow string with non-space characters', () => {
            const res = isRealString('   Josh   ');
            expect(res).toBe(true);
        });
    })