/**
 * Copyright 2020 Baidu Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ChartPage, {RenderChart} from '~/components/ChartPage';
import HistogramChart, {Loader as ChartLoader} from '~/components/HistogramPage/HistogramChart';
import {Modes, modes} from '~/resource/histogram';
import React, {FunctionComponent, useCallback, useMemo, useState} from 'react';

import {AsideSection} from '~/components/Aside';
import Content from '~/components/Content';
import Error from '~/components/Error';
import Field from '~/components/Field';
import RadioButton from '~/components/RadioButton';
import RadioGroup from '~/components/RadioGroup';
import RunAside from '~/components/RunAside';
import type {TagWithSingleRun} from '~/types';
import Title from '~/components/Title';
import useTagFilter from '~/hooks/useTagFilter';
import {useTranslation} from 'react-i18next';

const Histogram: FunctionComponent = () => {
    const {t} = useTranslation(['histogram', 'common']);

    const [running, setRunning] = useState(true);

    const {runs, tagsWithSingleRun, selectedRuns, onChangeRuns, loading} = useTagFilter('histogram', running);

    const [mode, setMode] = useState<Modes>(Modes.Offset);

    const aside = useMemo(
        () => (
            <RunAside
                runs={runs}
                selectedRuns={selectedRuns}
                onChangeRuns={onChangeRuns}
                running={running}
                onToggleRunning={setRunning}
                loading={loading}
            >
                <AsideSection>
                    <Field label={t('histogram:mode')}>
                        <RadioGroup value={mode} onChange={setMode}>
                            {modes.map(value => (
                                <RadioButton key={value} value={value}>
                                    {t(`histogram:mode-value.${value}`)}
                                </RadioButton>
                            ))}
                        </RadioGroup>
                    </Field>
                </AsideSection>
            </RunAside>
        ),
        [loading, mode, onChangeRuns, running, runs, selectedRuns, t]
    );

    const renderChart = useCallback<RenderChart<TagWithSingleRun>>(
        ({label, run}) => <HistogramChart run={run} tag={label} mode={mode} running={running} />,
        [running, mode]
    );

    return (
        <>
            <Title>{t('common:histogram')}</Title>
            <Content aside={aside}>
                {!loading && !runs.length ? (
                    <Error />
                ) : (
                    <ChartPage
                        items={tagsWithSingleRun}
                        renderChart={renderChart}
                        loader={<ChartLoader />}
                        loading={loading}
                    />
                )}
            </Content>
        </>
    );
};

export default Histogram;
