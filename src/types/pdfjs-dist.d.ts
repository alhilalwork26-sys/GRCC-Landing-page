declare module "pdfjs-dist" {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(options: {
    url: string;
    withCredentials?: boolean;
  }): {
    promise: Promise<{
      numPages: number;
      getPage(pageNumber: number): Promise<{
        getViewport(options: { scale: number }): { width: number; height: number };
        render(options: {
          canvasContext: CanvasRenderingContext2D;
          viewport: { width: number; height: number };
          canvas?: HTMLCanvasElement;
        }): { promise: Promise<void> };
      }>;
    }>;
  };
}
