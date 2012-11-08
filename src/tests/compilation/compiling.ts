///<reference path='..\..\..\typings\jasmine-1.2.d.ts' />
///<reference path='..\..\..\lib\TypeScript\compiler\typescript.ts' />

///<reference path='..\..\compilation\compiler.ts' />
///<reference path='..\..\compilation\conditionVisitor.ts' />
///<reference path='..\..\rules\rule.ts' />
///<reference path='..\..\rules\ruleBuilder.ts' />
///<reference path='..\..\rules\conditions\condition.ts' />

///<reference path='..\..\..\lib\TypeScript\compiler\' />
///<reference path='..\..\rules\' />
///<reference path='..\..\rules\conditions\' />
///<reference path='..\..\compilation\' />

module Treaty {
    module Tests {
        module Compilation {
            class NullNodeSelectorFactory implements Treaty.Compilation.INodeSelectorFactory {
                public create(): Treaty.Compilation.ISelectNode {
                    return null;
                }
            }

            class Example {
                public other: Other = new Other();
            }

            class Other {
                public another: Another = new Another();
            }

            class Another { 
                public andOneMore: OneMore = new OneMore(); 
            }

            class OneMore { }

            describe("compiling rules", () => {
                var subject: Treaty.Compilation.PropertyExpressionVisitor;
                var expressionParser: Treaty.Compilation.ExpressionParser;
                var selector: Treaty.Compilation.ISelectNode;

                beforeEach(() => {
                    subject = new Treaty.Compilation.PropertyExpressionVisitor('Example', new NullNodeSelectorFactory());
                    expressionParser = new Treaty.Compilation.ExpressionParser();
                });                

                describe("no level property", () => {
                    beforeEach(() => {
                        var script = expressionParser.parse((example: Example) => example);
                        var expression = new Treaty.Compilation.ExpressionAdapter().parse(script);

                        selector = subject.createSelector(expression);
                    });

                    it("should access no level property", () => {
                        expect(selector instanceof Treaty.Compilation.TypeNodeSelector).toBeTruthy();
                    });

                    it("should select expected type", () => {
                        var typeNodeSelector = <Treaty.Compilation.TypeNodeSelector>selector;
                        expect(typeNodeSelector.instanceType).toBe('Example');
                    });

                    it("should have no next", () => {
                        expect(selector.next).toBeNull();
                    });
                });

                describe("first level property", () => {
                    beforeEach(() => {
                        var script = expressionParser.parse((example: Example) => example.other);
                        var expression = new Treaty.Compilation.ExpressionAdapter().parse(script);
                        
                        selector = subject.createSelector(expression);
                    });

                    it("should access no level property", () => {
                        expect(selector instanceof Treaty.Compilation.TypeNodeSelector).toBeTruthy();
                    });

                    it("should select expected type", () => {
                        var typeNodeSelector = <Treaty.Compilation.TypeNodeSelector>selector;
                        expect(typeNodeSelector.instanceType).toBe('Example');
                    });

                    it("should access first level property", () => {
                        expect(selector.next instanceof Treaty.Compilation.PropertyNodeSelector).toBeTruthy();
                    });

                    it("should select expected property", () => {
                        var propertyNodeSelector = <Treaty.Compilation.PropertyNodeSelector>selector.next;
                        expect(propertyNodeSelector.memberName).toBe('other');
                    });

                    it("should have no next", () => {
                        expect(selector.next.next).toBeNull();
                    });
                });

                describe("second level property", () => {
                    beforeEach(() => {
                        var script = expressionParser.parse((example: Example) => example.other.another);
                        var expression = new Treaty.Compilation.ExpressionAdapter().parse(script);
                        
                        selector = subject.createSelector(expression);
                    });

                    it("should access no level property", () => {
                        expect(selector instanceof Treaty.Compilation.TypeNodeSelector).toBeTruthy();
                    });

                    it("should access first level property", () => {
                        expect(selector.next instanceof Treaty.Compilation.PropertyNodeSelector).toBeTruthy();
                    });

                    it("should access third level property", () => {
                        expect(selector.next.next instanceof Treaty.Compilation.PropertyNodeSelector).toBeTruthy();
                    });

                    it("should select expected property", () => {
                        var propertyNodeSelector = <Treaty.Compilation.PropertyNodeSelector>selector.next.next;
                        expect(propertyNodeSelector.memberName).toBe('another');
                    });

                    it("should have no next", () => {
                        expect(selector.next.next.next).toBeNull();
                    });
                });

                describe("third level property", () => {
                    beforeEach(() => {
                        var script = expressionParser.parse((example: Example) => example.other.another.andOneMore);
                        var expression = new Treaty.Compilation.ExpressionAdapter().parse(script);
                        
                        selector = subject.createSelector(expression);
                    });

                    it("should access no level property", () => {
                        expect(selector instanceof Treaty.Compilation.TypeNodeSelector).toBeTruthy();
                    });

                    it("should access first level property", () => {
                        expect(selector.next instanceof Treaty.Compilation.PropertyNodeSelector).toBeTruthy();
                    });

                    it("should access third level property", () => {
                        expect(selector.next.next instanceof Treaty.Compilation.PropertyNodeSelector).toBeTruthy();
                    });
                    
                    it("should access fourth level property", () => {
                        expect(selector.next.next.next instanceof Treaty.Compilation.PropertyNodeSelector).toBeTruthy();
                    });

                    it("should select expected property", () => {
                        var propertyNodeSelector = <Treaty.Compilation.PropertyNodeSelector>selector.next.next.next;
                        expect(propertyNodeSelector.memberName).toBe('andOneMore');
                    });

                    it("should have no next", () => {
                        expect(selector.next.next.next.next).toBeNull();
                    });
                });
            });
        }
    }
}
/*[Test]
public void Should_access_second_level_property()
{
    Expression<Func<A, C>> propertyExpression = (A a) => a.TheB.TheC;

    var visitor = new PropertyExpressionVisitor<A>(_configurator);

    NodeSelector selector = visitor.CreateSelector(propertyExpression.Body);

    selector.ConsoleWriteLine();

    Assert.IsInstanceOf<TypeNodeSelector<A>>(selector);
    Assert.IsInstanceOf<PropertyNodeSelector<A, B, B>>(selector.Next);
    Assert.IsInstanceOf<PropertyNodeSelector<A, B, C, C>>(selector.Next.Next);
    Assert.IsNull(selector.Next.Next.Next);
}

[Test]
public void Should_access_third_level_property()
{
    Expression<Func<A, string>> propertyExpression = (A a) => a.TheB.TheC.Value;

    var visitor = new PropertyExpressionVisitor<A>(_configurator);

    NodeSelector selector = visitor.CreateSelector(propertyExpression.Body);

    selector.ConsoleWriteLine();

    Assert.IsInstanceOf<TypeNodeSelector<A>>(selector);
    Assert.IsInstanceOf<PropertyNodeSelector<A, B,B>>(selector.Next);
    Assert.IsInstanceOf<PropertyNodeSelector<A, B, C, C>>(selector.Next.Next);
    Assert.IsInstanceOf<PropertyNodeSelector<Token<A, B>, C, string, string>>(selector.Next.Next.Next);
    Assert.IsNull(selector.Next.Next.Next.Next);
}*/