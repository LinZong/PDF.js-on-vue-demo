<template>
  <div>
    <p>PDF.js Run with Vue.js</p>
    <div ref="pdfContainerRef" id="pdfContainer" class="pdf-content">
      <canvas ref="PDFLayer"/>
      <div class="textLayer" ref="textLayerRef"/>
    </div>
  </div>
</template>
<script>
import * as PDFJS from "pdfjs-dist";
import { pdfBase64 } from "./DemoPDFBase64.js";
import {
  getOutputScale,
  CustomStyle,
  GetCanvasOffset
} from "./PDFRenderer/TextLayerBuilder.js";
import { TextLayerBuilder } from "pdfjs-dist/web/pdf_viewer";
import "./PDFRenderer/RenderStyle.css";
export default {
  name: "PdfDemo",
  mounted() {
    this.LoadPDF();
  },
  data() {
    return {
      scale: 1.5
    };
  },
  methods: {
    LoadPDF: async function() {
      let that = this;
      let PDFInstance = PDFJS.getDocument({ data: atob(pdfBase64) });
      PDFInstance.then(pdf => {
        pdf.getPage(1).then(page => {
          console.log("Loaded Page");
          let viewport = page.getViewport(that.scale);
          let canvas = that.$refs["PDFLayer"];
          let context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          that.$refs["pdfContainerRef"].style.height = canvas.height + "px";
          that.$refs["pdfContainerRef"].style.width = canvas.width + "px";

          let HiDPIScale = getOutputScale();

          if (HiDPIScale.scaled) {
            var cssScale =
              "scale(" + 1 / HiDPIScale.sx + ", " + 1 / HiDPIScale.sy + ")";
            CustomStyle.setProp("transform", canvas, cssScale);
            CustomStyle.setProp("transformOrigin", canvas, "0% 0%");
            if (that.$refs["pdfContainerRef"]) {
              CustomStyle.setProp(
                "transform",
                that.$refs["pdfContainerRef"],
                cssScale
              );
              CustomStyle.setProp(
                "transformOrigin",
                that.$refs["pdfContainerRef"],
                "0% 0%"
              );
            }
          }

          context._scaleX = HiDPIScale.sx;
          context._scaleY = HiDPIScale.sy;

          if (HiDPIScale.scaled) {
            context.scale(HiDPIScale.sx, HiDPIScale.sy);
          }

          let canvasOffset = GetCanvasOffset(canvas);
          that.$refs["textLayerRef"].style.height = viewport.height + "px";
          that.$refs["textLayerRef"].style.width = viewport.width + "px";
          that.$refs["textLayerRef"].style.top = canvasOffset.top + "px";
          that.$refs["textLayerRef"].style.left = canvasOffset.left + "px";

          let renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page
            .render(renderContext)
            .then(() => page.getTextContent())
            .then(textContent => {
              var textLayer = new TextLayerBuilder({
                textLayerDiv: that.$refs["textLayerRef"],
                pageIndex: page.pageIndex,
                viewport: viewport
              });
              textLayer.setTextContent(textContent);
              textLayer.render();
            });
        });
      });
    }
  }
};
</script>
