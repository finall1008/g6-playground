<template>
  <div id="test1">
    <div>
      <h4>Finall Test 1</h4>
      <p>测试 create-edge 是否能与 anchorPoints 配合</p>
    </div>
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";

export default {
  name: "FinallTest1",
  data() {
    return {
      graph: null,
      graphData: {
        // 点集
        nodes: [
          {
            id: "node1", // String，该节点存在则必须，节点的唯一标识
            x: 100, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label: "node1",
          },
          {
            id: "node2", // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label: "node2",
          },
          {
            id: "node3", // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label: "node3",
          },
        ],
      },
    };
  },
  mounted() {
    document.getElementById(
      "test1"
    ).style.height = `${document.documentElement.clientHeight}px`;
    this.initGraph();
  },
  methods: {
    initGraph() {
      this.graph = new G6.Graph({
        container: "mountNode", // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: this.width, // Number，必须，图的宽度
        height: this.height, // Number，必须，图的高度
        enableStack: true,
        layout: {
          // Object，可选，布局的方法及其配置项，默认为 random 布局。
          type: "dagre", // 指定为力导向布局
          preventOverlap: true, // 防止节点重叠
          nodesep: 50,
          ranksep: 12,
        },
        defaultNode: {
          type: "modelRect",
          size: [200, 100],
          linkPoints: {
            top: true,
            bottom: true,
          },
          anchorPoints: [
            [0.5, 0],
            [0.5, 1],
          ],
        },
        defaultEdge: {
          style: {
            endArrow: true,
          },
        },
        modes: {
          default: [
            {
              // 拖拽连边
              type: "create-edge",
              trigger: "drag",
              edgeConfig: {
                type: "cubic",
                style: {
                  stroke: "#000",
                  lineWidth: 2,
                },
              },
              shouldBegin: this.createEdgeShouldBegin,
              shouldEnd: this.createEdgeShouldEnd,
            },
            {
              // 拖动节点移位
              type: "drag-node",
              enableDelegate: true,
              shouldBegin: this.dragNodeShouldBegin,
            },
            {
              // 点击选中节点
              type: "click-select",
              multiple: false,
            },
          ],
        },
      });
      this.graph.data(this.graphData);
      this.graph.on("aftercreateedge", this.afterCreateEdge);
      this.graph.render();
    },
    createEdgeShouldBegin(e) {
      let node = e.item;
      console.log(node, node.getOutEdges(), node.getInEdges()); // TODO：无论如何都为空
      if (
        Math.abs(e.y - (node.get("model").y + 50)) <= 20 &&
        node.getOutEdges().length === 0
      ) {
        // this.setMode("creatingEdge");
        return true;
      }
      return false;
    },
    createEdgeShouldEnd(e) {
      let node = e.item;
      if (node.getInEdges().length === 0) return true;
      return false;
    },
    dragNodeShouldBegin(e) {
      let node = e.item;
      if (Math.abs(e.y - (node.get("model").y + 50)) <= 20) {
        // this.setMode("creatingEdge");
        return false;
      }
      return true;
    },
    afterCreateEdge(e) {
      let edge = e.edge;
      edge.update({
        sourceAnchor: 1,
        targetAnchor: 0,
      });
    },
  },
};
</script>

<style scoped>
#test1 {
  width: 100%;
  display: flex;
  flex-direction: column;
}
#mountNode {
  flex-grow: 1;
}
</style>