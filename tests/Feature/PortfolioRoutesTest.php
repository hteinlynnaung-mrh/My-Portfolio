<?php

namespace Tests\Feature;

use Tests\TestCase;

class PortfolioRoutesTest extends TestCase
{
    public function test_portfolio_pages_are_available(): void
    {
        foreach (['/', '/admin', '/json-generator'] as $uri) {
            $this->get($uri)->assertOk();
        }
    }
}
