import {axiosAppInstance, axiosTargetInstance} from '@shared/lib/axios';
import {AxiosPromise} from 'axios';
import {ResolveScreenNameResponse} from '@shared/lib/api/target/types/helper';

const METHOD = 'vk-api';

export const HelperApi = {
    resolveScreenName: async (screenName: string): AxiosPromise<ResolveScreenNameResponse> => {
        return axiosAppInstance.get(`${METHOD}/resolveScreenName/${screenName}`);
    },
};
