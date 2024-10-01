export interface IAoiDraw {
    wkt:string,
    colorType: string | undefined,
    idAoi?: string | undefined,
    name?: string | undefined,
    statusRule?:string | undefined
}

export interface ViewOptions {
    centerPosition?: 'center' | 'right' | 'custom';
    zoomLevel?: number;
    positionCustom? : {
        padding: any,
        duration: number
    }
  }