/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useRef, useEffect } from 'react';
import { Dropdown, Input, Icon } from '@citi-icg-172888/icgds-react';

export default function CustomizedContent({ teams, onTeamSelect }) {
    // console.log('Customcontent options:', teams);
    const [filterOptions, setFilterOptions] = useState([...teams]);
    const [list, setList] = useState([]);
    useEffect(() => {
        console.log('Selected values:', list);
    }, [list]);
    const [inputText, setInputText] = useState('');
    const searchRef = useRef();

    useEffect(() => {
        console.log('Selcted values:', list);
        if (onTeamSelect && list.length > 0) {
            onTeamSelect(list[0]);
        }
    }, [list, onTeamSelect]);

    const onInputFocus = (e) => {
        // console.log('onInputFocus:', e);
        if (inputText && inputText.length > 0) {
            let strLength = inputText.length;
            const input = e.target;
            if (input) {
                if (input.setSelectionRange !== undefined) {
                    input.setSelectionRange(strLength, strLength);
                    // console.log('input:', input);
                } else {
                    input.value = inputText;
                }
            }
        }
    };

    const focusSearch = (vis) => {
        // console.log('focusSearch:', vis);
        setTimeout(() => {
            if (vis && searchRef.current) {
                // console.log('searchRef:', searchRef.current);
                searchRef.current.focus();
            }
        }, 200);
    };

    const avoidTabToClose = (e) => {
        // Tab
        if (e.key === 'Tab') {
            e.stopPropagation();
        }
    };
    // const staticTeams = ['Asset Allocation Strategy', 'Bond Portfolio Analysis', 'Commodities', 'Credit', 'Economics', 'Equities', 'FX', 'Municipals', 'Rates'];
    console.log('filterOptions:', filterOptions);
    return (
        <Dropdown
            multiple
            placeholder='Select Teams'
            label={'Selected Teams( ' + list.length + ' )'}
            value={list}
            onApply={(val) => 
                {setList(val);
                console.log('onApply:', val);
            }}
            onClose={() => {
                setInputText('');
                setFilterOptions(teams);
            }}
            onVisibleChange={focusSearch}
            style={{ width: '200px' }}
            checkAllLabel="All Products"
            enableCheckAll={inputText.length === 0}
            onChange={(val) => setList(val)}
            dropdownRender={(optionsList, applyBtn) => {
                console.log('Input:', filterOptions);
                return (
                    <>
                        <div className="lmn-dropdown-header lmn-dropdown-header-search">
                            <div className="lmn-input-text lmn-search lmn-search-alt">
                                <Input
                                    placeholder="Search"
                                    aria-label="keyword to filter options"
                                    value={inputText}
                                    ref={searchRef}
                                    onFocus={onInputFocus}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setInputText(val);
                                        console.log('onChange:', val);
                                        setFilterOptions(
                                            teams.filter((item) => item[1].toLocaleLowerCase().includes(val.toLocaleLowerCase())),
                                        );
                                    }}
                                    onKeyDown={avoidTabToClose}
                                />
                                <Icon type="search" className="lmn-input-prefix-icon lmn-font-size-sm" />
                            </div>
                        </div>
                        {optionsList}
                        {applyBtn}
                    </>
                );
            }}
            getPopupContainer={() => document.querySelector('#app-content')}
        >
            {filterOptions.map((item) => {
                console.log('dropdown list:', item);
                return (
                    <Dropdown.Item key={item} value={item[0]} wrap>
                        <span>{item[1]}</span>
                    </Dropdown.Item>
                );
            })}
        </Dropdown>
    );
}