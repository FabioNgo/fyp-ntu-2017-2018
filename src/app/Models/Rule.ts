export interface Rule {
  keyword: string;
  token: string;
  isIdentifier?: boolean;
  ignore?: boolean;
  javaType?: string;
}
