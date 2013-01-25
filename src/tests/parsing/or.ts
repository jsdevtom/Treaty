///<reference path='..\testReferences.ts' />

module Treaty {
    module Tests {
        module Conditions {
            class Entity {
                constructor(public name: string, public gender: string) { }
            }            

            describe("parsing multiple predicate expressions", () => {
                var subject: Treaty.Rules.ConditionBuilder;
                var conditions: Treaty.Rules.ICondition[];

                describe("string member expression equals", () => {
                    beforeEach(() => {
                        subject = new Treaty.Rules.ConditionBuilder('Entity', (entity: Entity) => entity.name == 'Ben' || entity.gender == 'M');
                        conditions = subject.build(new Treaty.Compilation.ExpressionParser());
                    });
                
                    it("should parse conditions", () => {
                        expect(conditions.length).toBe(1);
                    });

                    it("should create one 'or' condition", () => {
                        expect(conditions[0] instanceof Treaty.Rules.Conditions.OrCondition).toBeTruthy();
                    });

                    it("should extract left and right conditions", () => {
                        var condition = <Treaty.Rules.Conditions.OrCondition>conditions[0];

                        expect(condition.instanceType).toBe('Entity');
                        expect(condition.leftCondition).toNotBe(null);
                        expect(condition.rightCondition).toNotBe(null);
                    });

                    it("should extract condition properties from first expression", () => {
                        var orCondition = <Treaty.Rules.Conditions.OrCondition>conditions[0];
                        var condition =  <Treaty.Rules.Conditions.PropertyEqualCondition>orCondition.leftCondition;

                        expect(condition.instanceType).toBe('Entity');
                        expect(condition.memberExpression).toNotBe(null);
                        expect(condition.value).toBe('Ben');
                    });

                    it("should extract condition properties from second expression", () => {
                        var orCondition = <Treaty.Rules.Conditions.OrCondition>conditions[0];
                        var condition =  <Treaty.Rules.Conditions.PropertyEqualCondition>orCondition.rightCondition;

                        expect(condition.instanceType).toBe('Entity');
                        expect(condition.memberExpression).toNotBe(null);
                        expect(condition.value).toBe('M');
                    });
                });
            });
        }
    }
}