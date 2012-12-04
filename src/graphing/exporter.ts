///<reference path='..\compilation\runtimeVisitor.ts' />
///<reference path='.\vertex.ts' />
///<reference path='.\edge.ts' />
///<reference path='.\rulesEngineGraph.ts' />

module Treaty {
    export module Graphing {

        export enum Shape {
            None = 0,
            Ellipse = 1,
            Circle = 2,
            DoubleCircle = 3,
        };

        export class Exporter {
            private output: string[] = []; 
            private vertices: DotVertex[] = [];

            constructor (private graph: RulesEngineGraph) {
                this.vertices = _.map(this.graph.vertices, (vertex: Vertex) => new DotVertex(vertex));
            }

            public toDotNotation(title: string): string {
                this.output = [];                 

                this.header(title);
                this.nodes();
                this.edges();
                this.footer();
                
                return this.output.join('\n');
            }

            private nodes(): void {
                _.each(this.vertices, (vertex: DotVertex) => {
                    this.node(vertex);
                });
            }

            private node(vertex: DotVertex): void {
                var attrs: string[] = [];

                attrs.push('shape=' + this.shape(vertex.shape()));
                attrs.push('style=filled');
                attrs.push('color=gainsboro');
                attrs.push('label="' + vertex.title + '"');
                //attrs.push('comment="' + vertex.targetType + '"');
                    
                this.append(vertex.identifier + ' [' + attrs.join(',') + '];')
            }

            private shape(shape: Shape): string {
                if (shape == Shape.Circle) return 'circle';
                if (shape == Shape.Ellipse) return 'ellipse';
                if (shape == Shape.DoubleCircle) return 'doublecircle';
                return '';
            }

            private edges(): void {
                _.each(this.graph.edges, (edge: Edge) => {
                    var from = new DotVertex(edge.from);
                    var to = new DotVertex(edge.to);

                    this.append(from.identifier + ' -> ' + to.identifier);
                });
            }

            private header(title: string): void {
                this.append('digraph ' + title.replace(' ', '') + ' {');
            }

            private footer(): void {
                this.append('fontsize=12;');
                this.append('}');
            }

            private append(line: string): void {
                this.output.push(line);
            }
        }

        export class DotVertex {
            public identifier: string;
            public title: string;
            public targetType: string;

            constructor (private vertex: Vertex) {
                this.identifier = 'n' + vertex.vertexType.toString() + vertex.id.toString();
                this.title = vertex.title;
                this.targetType = vertex.targetType;
            }

            public shape(): Shape {
                switch (this.vertex.vertexType) {
                    case VertexType.RulesEngine:
                    case VertexType.AlphaNode:
                    case VertexType.JoinNode:
                    case VertexType.LeftJoinNode:
                        return Shape.Ellipse;

                    case VertexType.ConstantNode:
                        return Shape.Circle;

                    case VertexType.DelegateProductionNode:
                        return Shape.DoubleCircle;

                    default:
                        return Shape.Circle;
                }
            }

            public is(shape: Shape): bool {
                return shape == this.shape();
            }
        }
    }
}