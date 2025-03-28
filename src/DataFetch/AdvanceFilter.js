// ./DataFetch/AdvanceFilter.js (or wherever your component is)
import React, { useState } from 'react';
// Import El for layout
import { Select, Option, Card, Button, El } from '@citi-icg-172888/icgds-react';

// Assuming you might want to pass functions to handle apply/clear/close
// You can add props like: ({ onApplyFilters, onClose })
export default function CustomizeFilter() {
    // State to store selected values for each filter
    const [filters, setFilters] = useState({
        sprint: null, // Use null or undefined for empty Select state
        domain: null,
        tpm: null,
        issueType: null,
        capability: null,
        productOwner: null,
    });

    // Handle change for each filter
    const onChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
        console.log(`Selected ${filterName}: ${value}`);
    };

    // Handle Apply button click
    const handleApply = () => {
        console.log('Applied Filters:', filters);
        // Pass filters up to parent component if needed
        // if (onApplyFilters) {
        //     onApplyFilters(filters);
        // }
        // Close the popover (this often needs state management in the parent)
        // if (onClose) {
        //     onClose();
        // }
    };

    // Handle Clear button click (reset selections)
    const handleClear = () => {
        setFilters({
            sprint: null,
            domain: null,
            tpm: null,
            issueType: null,
            capability: null,
            productOwner: null,
        });
        console.log('Filters cleared');
    };

    // Sample data for dropdowns (keep as is)
    const sprintOptions = [/* ... */];
    const domainOptions = [/* ... */];
    const tpmOptions = [/* ... */];
    const issueTypeOptions = [/* ... */];
    const capabilityOptions = [/* ... */];
    const productOwnerOptions = [/* ... */];
     // Add sample data back if missing from snippet
     // const sprintOptions = [ { title: 'Sprint 1', label: 'Sprint 1', value: 'sprint1' }, ...];
     // const domainOptions = [ { title: 'Domain A', label: 'Domain A', value: 'domainA' }, ...];
     // const tpmOptions = [ { title: 'TPM 1', label: 'TPM 1', value: 'tpm1' }, ... ];
     // const issueTypeOptions = [ { title: 'Bug', label: 'Bug', value: 'bug' }, ... ];
     // const capabilityOptions = [ { title: 'Capability 1', label: 'Capability 1', value: 'capability1' }, ...];
     // const productOwnerOptions = [ { title: 'Owner 1', label: 'Owner 1', value: 'owner1' }, ...];


    // Common filter function for search (keep as is)
    const customizeFilter = (input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

    return (
        // Use Card, set appropriate width and padding. Remove layout classes like lmn-col-*.
        <Card
            className="lmn-p-16px" // Use standard padding class
            style={{ width: '500px' /* Adjust width as needed */ }}
            // Remove ref unless needed, remove hover, remove getPopupContainer from Card
        >
            {/* Use Card header mechanism with ICGDS typography */}
            <p header className="lmn-h4 lmn-mb-16px">Extended Filters</p>

            {/* Use Card body, remove its default padding if grid handles spacing */}
            <Card body style={{ padding: 0 }}>
                {/* Use ICGDS grid system */}
                <El className="lmn-row lmn-gutter-16"> {/* Row with 16px gutters */}
                    {/* Sprint Filter */}
                    <El className="lmn-col-6 lmn-mb-16px"> {/* Half width, bottom margin */}
                        <Select
                            label="Sprint" // Use label prop
                            showSearch
                            highlightOption
                            block // Make select fill column
                            placeholder="Select an option"
                            onChange={(value) => onChange('sprint', value)}
                            optionLabelProp="label"
                            customizeFilter={customizeFilter}
                            // Remove getPopupContainer - let it render within popover
                            value={filters.sprint}
                            allowClear // Optional: Add clear button inside select
                        >
                            {sprintOptions.map((option) => (
                                <Option key={option.value} title={option.title} label={option.label} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </El>

                    {/* Domain Filter */}
                    <El className="lmn-col-6 lmn-mb-16px">
                        <Select
                            label="Domain"
                            showSearch
                            highlightOption
                            block
                            placeholder="Select an option"
                            onChange={(value) => onChange('domain', value)}
                            optionLabelProp="label"
                            customizeFilter={customizeFilter}
                            value={filters.domain}
                            allowClear
                        >
                            {domainOptions.map((option) => (
                                <Option key={option.value} title={option.title} label={option.label} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </El>

                    {/* TPM Filter */}
                     <El className="lmn-col-6 lmn-mb-16px">
                        <Select
                            label="TPM"
                            showSearch
                            highlightOption
                            block
                            placeholder="Select an option"
                            onChange={(value) => onChange('tpm', value)}
                            optionLabelProp="label"
                            customizeFilter={customizeFilter}
                            value={filters.tpm}
                            allowClear
                        >
                            {tpmOptions.map((option) => (
                                <Option key={option.value} title={option.title} label={option.label} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </El>

                    {/* Issue Type Filter */}
                    <El className="lmn-col-6 lmn-mb-16px">
                        <Select
                            label="Issue Type"
                            showSearch
                            highlightOption
                            block
                            placeholder="Select an option"
                            onChange={(value) => onChange('issueType', value)}
                            optionLabelProp="label"
                            customizeFilter={customizeFilter}
                            value={filters.issueType}
                            allowClear
                        >
                            {issueTypeOptions.map((option) => (
                                <Option key={option.value} title={option.title} label={option.label} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </El>

                    {/* Capability Filter */}
                    <El className="lmn-col-6 lmn-mb-16px">
                        <Select
                            label="Capability"
                            showSearch
                            highlightOption
                            block
                            placeholder="Select an option"
                            onChange={(value) => onChange('capability', value)}
                            optionLabelProp="label"
                            customizeFilter={customizeFilter}
                            value={filters.capability}
                            allowClear
                        >
                            {capabilityOptions.map((option) => (
                                <Option key={option.value} title={option.title} label={option.label} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </El>

                    {/* Product Owner Filter */}
                    <El className="lmn-col-6 lmn-mb-16px">
                        <Select
                            label="Product Owner"
                            showSearch
                            highlightOption
                            block
                            placeholder="Select an option"
                            onChange={(value) => onChange('productOwner', value)}
                            optionLabelProp="label"
                            customizeFilter={customizeFilter}
                            value={filters.productOwner}
                            allowClear
                        >
                            {productOwnerOptions.map((option) => (
                                <Option key={option.value} title={option.title} label={option.label} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </El>
                </El> {/* End lmn-row */}

                {/* Buttons - Use ICGDS flex utilities */}
                <El className="lmn-d-flex lmn-justify-content-end lmn-mt-16px">
                    <Button onClick={handleClear} className="lmn-mr-8px" color="secondary" /* Use secondary or outline */ >
                        Clear
                    </Button>
                    <Button onClick={handleApply} color="primary">
                        Apply
                    </Button>
                </El>
            </Card> {/* End Card body */}
        </Card> // End Outer Card
    );
}
