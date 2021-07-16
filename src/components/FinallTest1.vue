<template>
  <div id="test1">
    <div>
      <h4>Finall Test 1</h4>
      <p>Flok 编辑页面画布 Demo</p>
    </div>
    <div id="mountNode"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
const { detectAllCycles } = G6.Algorithm;

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
    // 是否允许开始拖拽连边
    createEdgeShouldBegin(e) {
      let node = e.item;
      if (
        Math.abs(e.y - (node.get("model").y + 50)) <= 20 && // 拖拽节点下部触发
        // 当前节点还没有出边
        // getOutEdges() 不知道为什么总为空，这样解决了
        node.getEdges().filter((edge) => {
          return edge.getSource().get("model").id === node.get("model").id;
        }).length === 0
      ) {
        return true;
      }
      return false;
    },
    createEdgeShouldEnd(e) {
      let node = e.item;
      if (
        // 当前节点还没有入边
        // getInEdges() 不知道为什么总为空，这样解决了
        node.getEdges().filter((edge) => {
          return edge.getTarget().get("model").id === node.get("model").id;
        }).length === 0
      ) {
        return true;
      }
      return false;
    },
    dragNodeShouldBegin(e) {
      let node = e.item;
      if (Math.abs(e.y - (node.get("model").y + 50)) <= 20) {
        // 拖拽节点上部触发
        return false;
      }
      return true;
    },
    afterCreateEdge(e) {
      let edge = e.edge;
      this.graphData = this.graph.save();
      // 不允许成环
      if (detectAllCycles(this.graphData, true).length !== 0) {
        // 延时删除，防止报错
        setTimeout(() => {
          this.graph.removeItem(edge);
          this.graphData = this.graph.save();
        }, 100);
      } else {
        // 吸附到正确的 anchorPoint
        edge.update({
          sourceAnchor: 1,
          targetAnchor: 0,
        });
      }
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