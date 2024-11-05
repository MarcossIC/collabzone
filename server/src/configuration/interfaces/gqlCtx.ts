import { MercuriusContext } from 'mercurius';
import { IWsCtx } from './wsCtx';

export interface IGqlCtx extends MercuriusContext {
  ws?: IWsCtx;
}