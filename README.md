# MMM-AntenneUnnaTraffic
A module for the MagicMirror project which creates a table filled with traffic data from radio unna in germany.

Forked and customized from MMM-JsonTable Module.

## Installation
````
git clone https://github.com/eckonator/MMM-AntenneUnnaTraffic.git
````

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| url | "" | The full url to get the json response from |
| arrayName | null | Define the name of the variable that holds the array to display |
| keepColumns | [] | Columns on json will be showed |
| tryFormatDate | false | For every column it checks if a valid DateTime is given, and then formats it to HH:mm:ss if it is today or YYYY-MM-DD otherwise |
| size | 0-3 | Text size at table, 0 is default, and 3 is H3 |
| updateInterval | 15000 | Milliseconds between the refersh |
| descriptiveRow | "" | Complete html table row that will be added above the array data |

## Example

Configuration:

```javascript
modules: [
    {
        module: 'MMM-AntenneUnnaTraffic',
        position: 'top_left',
        header: 'Unfälle (überregional)',
        config: {
            url: 'https://api-prod.nrwlokalradios.com/traffic/detail?station=42', // Required
            arrayName: 'overregional.accident'
        }
    },
    {
        module: 'MMM-AntenneUnnaTraffic',
        position: 'top_left',
        header: 'Baustellen (überregional)',
        config: {
            url: 'https://api-prod.nrwlokalradios.com/traffic/detail?station=42', // Required
            arrayName: 'overregional.construction'
        }
    }
]
```