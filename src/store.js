// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import keplerGlReducer from 'kepler.gl/reducers';
import appReducer from './app-reducer';
import { taskMiddleware } from 'react-palm/tasks';
import window from 'global/window';
import * as Immutable from 'immutable';
import { MAPID } from './app';

const customizedKeplerGlReducer = keplerGlReducer
    .initialState({
        uiState: {
            // hide side panel to disallower user customize the map
            readOnly: true,

            // customize which map control button to show
            mapControls: {
                visibleLayers: {
                    show: false
                },
                mapLegend: {
                    show: true,
                    active: true
                },
                toggle3d: {
                    show: false
                },
                splitMap: {
                    show: false
                }
            },
            // "mapStyle": {
            //     "bottomMapStyle": {
            //         "sources": {
            //             "aaa": {
            //                 "type": "raster",
            //                 "tiles": [
            //                     "http://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fplanet-disaster-data%2Fhurricane-harvey%2FSkySat_Freeport_s03_20170831T162740Z3.tif"
            //                 ],
            //                 "tileSize": 256
            //             }
            //         },
            //         "layers": [
            //             {
            //                 "id": "bbb",
            //                 "type": "raster",
            //                 "source": "aaa",
            //                 "layout": {
            //                     "visibility": "visible"
            //                 },
            //                 "paint": {
            //                     "raster-opacity": 1
            //                 }
            //             }
            //         ]
            //     },
            // }

        }
    })
    // handle additional actions
    .plugin({
        HIDE_AND_SHOW_SIDE_PANEL: (state, action) => ({
            ...state,
            uiState: {
                ...state.uiState,
                readOnly: !state.uiState.readOnly
            }
        }),

    });


const newLayers = Immutable.fromJS({
    'id': 'bbb',
    'type': 'raster',
    'source': 'aaa',
    'layout': {
        'visibility': 'visible'
    },
    paint: {
        'raster-opacity': 1,
    }
});
const newLayers2 = Immutable.fromJS({
    'id': 'bbbc',
    'type': 'raster',
    'source': 'aaac',
    'layout': {
        'visibility': 'visible'
    },
    paint: {
        'raster-opacity': 1,
    }
});
//https://oin-hotosm.s3.amazonaws.com/56f9b5a963ebf4bc00074e70/0/56f9c2d42b67227a79b4faec.tif
const newSource = Immutable.fromJS({
    type: 'raster',
    // tiles: ['http://192.168.233.130:8080/styles/klokantech-basic/{z}/{x}/{y}.png'],
    tiles: [
        'http://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fplanet-disaster-data%2Fhurricane-harvey%2FSkySat_Freeport_s03_20170831T162740Z3.tif',
        // 'http://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=https%3A%2F%2Foin-hotosm.s3.amazonaws.com/56f9b5a963ebf4bc00074e70/0/56f9c2d42b67227a79b4faec.tif',
    ],
    tileSize: 256
});
const newSource2 = Immutable.fromJS({
    type: 'raster',
    // tiles: ['http://192.168.233.130:8080/styles/klokantech-basic/{z}/{x}/{y}.png'],
    tiles: [
        // 'http://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fplanet-disaster-data%2Fhurricane-harvey%2FSkySat_Freeport_s03_20170831T162740Z3.tif',
        'http://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=https%3A%2F%2Foin-hotosm.s3.amazonaws.com/56f9b5a963ebf4bc00074e70/0/56f9c2d42b67227a79b4faec.tif',
    ],
    tileSize: 256
});
export const injectTiles = (bottomMapStyle) => {
    let ImmuableState = bottomMapStyle;
    // console.log(newLayers);

    if (ImmuableState && ImmuableState.has('layers') && !ImmuableState.get('layers').find(e => e['id'] === 'bbb')) {
        console.log('myInject');
        ImmuableState = ImmuableState.update('layers', layers => layers.push(newLayers));
        ImmuableState = ImmuableState.update('layers', layers => layers.push(newLayers2));
        ImmuableState = ImmuableState.update('sources', sources => sources.set('aaa', newSource));
        ImmuableState = ImmuableState.update('sources', sources => sources.set('aaac', newSource2));
    }
    return ImmuableState;
};
// const mykeplerGlReducer = (state, action) => {
//     let new_state = customizedKeplerGlReducer(state, action);
//     // console.log(new_state);
//     if (new_state && new_state[MAPID] && ['@@kepler.gl/LOAD_MAP_STYLES', '@@kepler.gl/MAP_STYLE_CHANGE'].includes(action.type)) {
//         // console.log(ImmuableState);
//         new_state[MAPID].mapStyle.bottomMapStyle = injectTiles(new_state[MAPID].mapStyle.bottomMapStyle);
//         console.log('mykeplerGlReducer', new_state);
//     }
//     if (action.type !== '@@kepler.gl/LAYER_HOVER') {
//
//         // console.log(action);
//     }
//     return new_state;
// };
const mykeplerGlReducer2 = (state, action) => {
    let new_state = customizedKeplerGlReducer(state, action);
    new_state[MAPID].mapStyle.bottomMapStyle = injectTiles(new_state[MAPID].mapStyle.bottomMapStyle);
    console.log('mykeplerGlReducer', new_state);
    return new_state;
};
const reducers = combineReducers({
    keplerGl: customizedKeplerGlReducer,
    app: appReducer
});

const composedReducer = (state, action) => {
    if (state.keplerGl && state.keplerGl[MAPID] && ['@@kepler.gl/LOAD_MAP_STYLES', '@@kepler.gl/MAP_STYLE_CHANGE'].includes(action.type)) {
        // new_state.keplerGl[MAPID].mapStyle.bottomMapStyle = injectTiles(state.keplerGl[MAPID].mapStyle.bottomMapStyle);
        return {...state,keplerGl: mykeplerGlReducer2(state.keplerGl,action)};
    }
    // console.log(state);
    return reducers(state, action);
};

const middlewares = [taskMiddleware];
const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

// add redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    composedReducer,
    initialState,
    composeEnhancers(...enhancers)
);
