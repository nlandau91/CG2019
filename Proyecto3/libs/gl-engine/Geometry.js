import { VertexBuffer } from "./VertexBuffer.js"
import { IndexBuffer } from "./IndexBuffer.js"

export class Geometry {
    constructor(gl, geometryData) {
        const { vertexPositions, vertexNormals, vertexTextureCoordinates } = geometryData
        const { indexLines, indexTriangles } = geometryData

        this.vertexBuffers = {}
        if (vertexPositions.length) this.vertexBuffers["vertexPosition"] = new VertexBuffer(gl, vertexPositions)
        if (vertexNormals.length) this.vertexBuffers["vertexNormal"] = new VertexBuffer(gl, vertexNormals)
        if (vertexTextureCoordinates.length) this.vertexBuffers["vertexTextureCoordinates"] = new VertexBuffer(gl, vertexTextureCoordinates)

        this.indexBuffers = {}
        this.indexBuffers.lines = new IndexBuffer(gl, indexLines)
        this.indexBuffers.triangles = new IndexBuffer(gl, indexTriangles)
    }
}
